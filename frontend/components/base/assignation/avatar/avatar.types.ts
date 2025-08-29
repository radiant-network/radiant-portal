export interface AvatarUser {
  id: string;
  name: string;
  initials?: string;
}

export interface AvatarProps {
  users?: AvatarUser[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'data-testid'?: string;
}

export interface BaseAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'data-testid'?: string;
}

export interface SingleAvatarProps extends BaseAvatarProps {
  user: AvatarUser;
}

export interface DualAvatarProps extends BaseAvatarProps {
  users: [AvatarUser, AvatarUser];
}

export interface CountAvatarProps extends BaseAvatarProps {
  firstUser: AvatarUser;
  additionalCount: number;
}
