import { z } from 'zod';

import { type Block } from '../types';

// Code dormant pour le moment juste pour expliquer le futur fonctionnement

/**
 * WIRE FORMAT — le contrat entre le backend et le front pour une réponse de l'assistant.
 *
 * POURQUOI CE FICHIER EXISTE
 * --------------------------
 * Aujourd'hui, `mockEngine` fabrique directement des `Block[]` (nos types internes).
 * Demain, le backend renverra du JSON. Ce JSON ne sera PAS un `Block[]` : ce sera
 * une structure séparée, produite par un LLM, qu'on ne contrôle pas à 100 %.
 *
 * Ce fichier est la couche d'adaptation (« anti-corruption layer ») entre ce JSON
 * externe et notre modèle de domaine (`Block` dans ../types.ts). Objectif : le
 * format du backend ne doit JAMAIS fuiter jusqu'aux composants d'UI. L'UI ne
 * connaît que `Block`.
 *
 * LES ÉTAPES À VENIR (roadmap)
 * ----------------------------
 * 1. [FAIT] Le mock renvoie des `Block[]` typés → l'UI est branchée.
 * 2. [CE FICHIER] On fige un contrat de wire format (les schémas Zod ci-dessous)
 *    et une factory `parseBlocks(json)` qui valide + mappe vers `Block[]`.
 * 3. [À VENIR] Un `HttpEngine` (implémentant `AssistantEngine`) appelle le backend,
 *    passe la réponse brute dans `parseBlocks`, et retourne le `Block[]` obtenu.
 *    Aucun composant d'UI ne change.
 * 4. [À VENIR — CÔTÉ BACK] Le backend garantit ce format via le « structured output /
 *    tool-calling » du LLM (on impose un JSON Schema équivalent à celui-ci), plutôt
 *    que d'espérer qu'un modèle « entraîné » renvoie du JSON cohérent. Ce fichier
 *    devient alors la source de vérité du contrat, à partager avec l'équipe back.
 *
 * NB : les schémas ci-dessous reflètent volontairement nos `Block` (mapping mince).
 * Si le format réel du backend diverge (noms de champs, structure), c'est ICI —
 * et uniquement ici — qu'on adapte. L'UI reste intacte.
 */

const wireTextBlock = z.object({
  type: z.literal('text'),
  content: z.string(),
});

const wireTableBlock = z.object({
  type: z.literal('table'),
  title: z.string().optional(),
  columns: z.array(z.object({ key: z.string(), label: z.string() })),
  rows: z.array(z.record(z.string(), z.string())),
});

const wireChartBlock = z.object({
  type: z.literal('chart'),
  title: z.string().optional(),
  categoryLabel: z.string(),
  valueLabel: z.string(),
  data: z.array(z.object({ label: z.string(), count: z.number() })),
});

/** Un bloc du wire format : union discriminée sur `type`, comme nos `Block`. */
const wireBlock = z.discriminatedUnion('type', [wireTextBlock, wireTableBlock, wireChartBlock]);

/** L'enveloppe de réponse. Le backend renvoie une liste de blocs. */
const wireReply = z.object({
  blocks: z.array(z.unknown()),
});

export type WireBlock = z.infer<typeof wireBlock>;

/**
 * Mappe un bloc du wire format (ce qui est envoyé par le back) vers notre `Block` interne.
 *
 * Le mapping est explicite (champ par champ) et non un simple cast : c'est la
 * frontière du modèle de domaine. Quand le format backend divergera du nôtre,
 * c'est cette fonction qu'on ajuste — pas l'UI.
 */
function toBlock(wire: WireBlock): Block {
  switch (wire.type) {
    case 'text':
      return { type: 'text', content: wire.content };
    case 'table':
      return { type: 'table', title: wire.title, columns: wire.columns, rows: wire.rows };
    case 'chart':
      return {
        type: 'chart',
        title: wire.title,
        categoryLabel: wire.categoryLabel,
        valueLabel: wire.valueLabel,
        data: wire.data,
      };
  }
}

/**
 * LA FACTORY : transforme le JSON brut du backend en `Block[]` sûrs pour l'UI.
 *
 * Ne lève jamais d'exception — une réponse malformée ne doit pas casser le chat :
 * - enveloppe invalide  → un bloc texte de repli ;
 * - bloc individuel invalide ou type inconnu → ce bloc est ignoré (dégradation
 *   gracieuse / forward-compat : un futur type de bloc pas encore supporté par le
 *   front ne fait pas planter le reste de la réponse).
 */
export function parseBlocks(json: unknown): Block[] {
  const reply = wireReply.safeParse(json);
  if (!reply.success) {
    return [{ type: 'text', content: "Sorry, I couldn't read the assistant's response." }];
  }

  const blocks: Block[] = [];
  for (const raw of reply.data.blocks) {
    const parsed = wireBlock.safeParse(raw);
    // Bloc inconnu ou invalide : on l'ignore plutôt que de tout faire échouer.
    if (parsed.success) {
      blocks.push(toBlock(parsed.data));
    }
  }
  return blocks;
}
