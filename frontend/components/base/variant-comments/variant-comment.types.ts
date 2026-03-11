import { AvatarUser } from '@/components/base/assignation/avatar/avatar.types';

export interface VariantComment {
  id: string;
  author: AvatarUser;
  body: string;
  createdAt: string;
  updatedAt: string;
}
