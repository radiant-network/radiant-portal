"""``patient_timeline``: a patient's clinical events on one time axis."""

from fastmcp.tools import ToolResult

from ... import charts
from ... import portal_api as _api
from ...portal_api import RadiantApi
from ...results import ToolOutput, error, ok, respond
from ...services.patients import PATIENT_KEY, patient_context
from ._common import DAYS_PER_YEAR

_TRACKS = ("Events", "Surgery", "Radiation", "Chemotherapy", "Imaging")


def _years(day) -> float | None:
    return day / DAYS_PER_YEAR if isinstance(day, (int, float)) else None


def timeline_items(context: dict) -> list[charts.TimelineItem]:
    items: list[charts.TimelineItem] = []
    patient = context.get("patient", {})
    for event in patient.get("events", []):
        start = _years(event.get("day"))
        if start is not None:
            items.append(charts.TimelineItem("Events", start, label=(event.get("event_type") or "").replace("_", " ")))
    treatments = context.get("treatments") or {}
    for surgery in treatments.get("surgeries", []):
        start = _years(surgery.get("day"))
        if start is not None:
            items.append(charts.TimelineItem("Surgery", start, label=surgery.get("extent_of_tumor_resection") or ""))
    for radiation in treatments.get("radiations", []):
        start = _years((radiation.get("start") or {}).get("day"))
        if start is not None:
            items.append(charts.TimelineItem("Radiation", start, _years((radiation.get("stop") or {}).get("day")),
                                             label=radiation.get("site") or ""))
    for therapy in treatments.get("therapies", []):
        start = _years((therapy.get("start") or {}).get("day"))
        if start is not None:
            label = therapy.get("protocol_name") or ", ".join(therapy.get("chemotherapy_agents") or [])[:40]
            items.append(charts.TimelineItem("Chemotherapy", start, _years((therapy.get("stop") or {}).get("day")),
                                              label=label))
    for session in (context.get("imaging") or {}).get("sessions", []):
        start = _years(session.get("day"))
        if start is not None:
            items.append(charts.TimelineItem("Imaging", start))
    vital_day = _years((patient.get("vital_status_at") or {}).get("day"))
    if vital_day is not None:
        items.append(charts.TimelineItem("Events", vital_day, label=f"vital status: {patient.get('vital_status', '')}"))
    return items


def _patient_timeline(api: RadiantApi, token: str, patient_key: str, tenant: str | None) -> ToolOutput:
    context = patient_context(api, token, patient_key, tenant, ["treatments", "imaging"])
    portal_url = context["patient"].get("portal_url")
    items = timeline_items(context)
    if not items:
        return ok({"tenant": context["tenant"], "items_per_track": {}},
                  warnings=[*context["warnings"], "No dated event, treatment or imaging for this patient: "
                                                  "no chart drawn."], portal_url=portal_url)
    tracks = [t for t in _TRACKS if any(i.track == t for i in items)]
    png = charts.timeline(items, tracks, "Patient history")
    counts = {t: sum(1 for i in items if i.track == t) for t in tracks}
    return ok({"tenant": context["tenant"], "items_per_track": counts,
               "axis": "age in years (days from birth / 365.25)"},
              warnings=context["warnings"], portal_url=portal_url, image=png)


async def patient_timeline(patient_key: str, tenant: str | None = None) -> ToolResult:
    """A patient's history on one age axis: events (diagnosis, progression,
    recurrence), surgeries, radiation and chemotherapy periods, imaging
    sessions and the vital status, from the portal patient page.

    Args:
        patient_key: The patient page key (a UUID, from search_patients or get_case_context).
        tenant: Tenant code (auto-resolved when the user has only one).
    """
    patient_key = (patient_key or "").strip()
    if not PATIENT_KEY.fullmatch(patient_key):
        return respond(error("invalid_input",
                             f"`{patient_key}` is not a patient key (a UUID). Find it with search_patients first."))
    # Keys are stored lower-case: a key copied upper-case would not be found.
    return await _api.run(_patient_timeline, patient_key.lower(), tenant)
