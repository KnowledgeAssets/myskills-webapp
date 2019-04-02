import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';
import { User } from '../users/user';

export class MemberLeftCommunityNotification extends AbstractNotification {
  community: Community;
  user: User;

  getTypeText(): string {
    return 'A member leaving a community';
  }
}