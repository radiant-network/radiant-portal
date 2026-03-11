import { useCallback, useState } from 'react';

import { VariantComment } from './variant-comment.types';

const MOCK_CURRENT_USER = {
  id: 'user-1',
  name: 'Vincent Ferretti',
  email: 'vincent.ferretti@example.com',
};

const MOCK_COMMENTS: VariantComment[] = [
  {
    id: 'comment-1',
    author: {
      id: 'user-1',
      name: 'Vincent Ferretti',
      email: 'vincent.ferretti@example.com',
    },
    body: '<p>This variant has been reported in ClinVar as <strong>pathogenic</strong> with multiple submissions confirming the classification.</p>',
    createdAt: '2026-03-12T15:22:00Z',
    updatedAt: '2026-03-12T15:46:00Z',
  },
  {
    id: 'comment-2',
    author: {
      id: 'user-2',
      name: 'Sophie Martin',
      email: 'sophie.martin@example.com',
    },
    body: '<p>Reviewed the segregation data — consistent with <em>autosomal dominant</em> inheritance in this family.</p>',
    createdAt: '2026-03-12T14:10:00Z',
    updatedAt: '2026-03-12T14:10:00Z',
  },
];

export function useCurrentUser() {
  return MOCK_CURRENT_USER;
}

export function useVariantComments() {
  const [comments, setComments] = useState<VariantComment[]>(MOCK_COMMENTS);
  const currentUser = useCurrentUser();

  const addComment = useCallback(
    (body: string) => {
      const now = new Date().toISOString();
      const newComment: VariantComment = {
        id: `comment-${Date.now()}`,
        author: currentUser,
        body,
        createdAt: now,
        updatedAt: now,
      };
      setComments(prev => [newComment, ...prev]);
    },
    [currentUser],
  );

  const updateComment = useCallback((commentId: string, body: string) => {
    setComments(prev => prev.map(c => (c.id === commentId ? { ...c, body, updatedAt: new Date().toISOString() } : c)));
  }, []);

  const deleteComment = useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, []);

  return {
    comments,
    addComment,
    updateComment,
    deleteComment,
    currentUser,
  };
}

export function useVariantCommentsEmpty() {
  const [comments] = useState<VariantComment[]>([]);
  const currentUser = useCurrentUser();

  return {
    comments,
    addComment: (_body: string) => {
      // no-op for empty state story
    },
    updateComment: (_commentId: string, _body: string) => {
      // no-op for empty state story
    },
    deleteComment: (_commentId: string) => {
      // no-op for empty state story
    },
    currentUser,
  };
}
