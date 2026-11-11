"""Chart tools (RAD-254): family Venn, survival, oncoprint, lollipop, patient
timeline and bar chart, returned as MCP image content, one module per chart.

Each tool reads its data itself, under the caller's JWT (portal API for
clinical data, curated SQL for genomic data), draws it with ``radiant_mcp.charts``
and returns the common result (``results``) with the values drawn in ``data``,
then the PNG as an image part, so the model can comment on the chart and a
reader without the image still gets the numbers. LibreChat
saves MCP images as message attachments and shows them in the conversation.
"""

from .bar import bar_chart
from .lollipop import lollipop
from .oncoprint import oncoprint
from .survival import survival_curve
from .timeline import patient_timeline
from .venn import family_venn

__all__ = ["bar_chart", "family_venn", "lollipop", "oncoprint", "patient_timeline", "survival_curve"]
