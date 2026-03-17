import { HttpResponse } from 'msw';

export const notesListApi = `api/notes/:type/:case_id/:seq_id/:task_id/:locus_id`;

export function getHTTPMockNotesList() {
  return HttpResponse.json([
    {
      user: {
        id: '1',
        name: 'John Doe',
        initials: 'JD',
        email: 'johndoe@email.com',
        organization: 'CHU',
      },
      createdAt: '2026-01-26T18:33:17.99406Z',
      updatedAt: '2026-01-30T20:44:42.99406Z',
      text: '<p dir="auto" style="text-align: left">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> for Reactjs</p><p dir="auto"></p><p dir="auto"><strong>Features</strong></p><ul dir="auto"><li dir="auto"><p dir="auto">Use React, tailwindcss, <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> components</p></li><li dir="auto"><p dir="auto">I18n support (vi, en, zh, pt, ...)</p></li><li dir="auto"><p dir="auto">Slash Commands (type <code>/</code> to show menu list)</p></li><li dir="auto"><p dir="auto">Multi Column</p></li><li dir="auto"><p dir="auto">Support emoji <span dir="auto" data-name="100" data-type="emoji">💯</span> (type <code>:</code> to show emoji list)</p></li><li dir="auto"><p dir="auto">Support iframe</p></li><li dir="auto"><p dir="auto">Support mermaid</p></li><li dir="auto"><p dir="auto">Support mention <span class="mention" data-type="mention" dir="auto" data-id="0" data-label="hunghg255" data-mention-suggestion-char="@">@hunghg255</span> (type <code>@</code> to show list)</p></li><li dir="auto"><p dir="auto">Suport katex math (<span class="katex" dir="auto" text="c%20%3D%20%5Cpm%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D" macros=""></span>)</p></li></ul><p dir="auto"></p>',
    },

    {
      user: {
        id: '2',
        name: 'Jeanne Tremblay',
        initials: 'JT',
        email: 'jeannetrembley@email.com',
        organization: 'CHU',
      },
      createdAt: '2026-01-26T18:33:17.99406Z',
      text: '<p dir="auto"><span style="font-family: &quot;Open Sans&quot;, Arial, sans-serif; font-size: 14px; color: rgb(0, 0, 0)">Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Etiam est ligula</strong>, dignissim vitae diam sit amet, commodo vehicula leo. </span></p><p dir="auto"></p><p dir="auto"><span style="font-family: &quot;Open Sans&quot;, Arial, sans-serif; font-size: 14px; color: rgb(0, 0, 0)">Duis nec venenatis orci, ac congue arcu.<u> Aliquam ultrices mattis</u> orci id sollicitudin. <em>Pellentesque fringilla felis</em> nec ipsum imperdiet, id placerat quam porta. Integer interdum sit amet mi eu elementum. </span></p><p dir="auto"></p><p dir="auto"><span style="font-family: &quot;Open Sans&quot;, Arial, sans-serif; font-size: 14px; color: rgb(0, 0, 0)">Suspendisse aliquet nunc sit amet erat cursus, in vulputate ante rutrum. <mark data-color="#FFEC3D" style="background-color: #FFEC3D; color: inherit">Donec ac eros id lectus fermentum congue.</mark></span></p>',
    },
  ]);
}
