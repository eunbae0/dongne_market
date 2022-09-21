import { atom } from 'recoil';
import { v1 as uuid } from 'uuid';
// import { recoilPersist } from 'recoil-persist';

// const { persistAtom } = recoilPersist({key: 'userId'});

const userInfo = atom({
  key: `userInfo/${uuid()}`,
  default: {
    isLogin: false,
    uid: '',
    nickname: '',
    email: '',
  },
});

const userId = atom({
  key: `userId/${uuid()}`,
  default: '',
});

const authCurrentStep = atom({
  key: `authCurrentStep/${uuid()}`,
  default: 0,
  // effects_UNSTABLE: [persistAtom],
});
// eslint-disable-next-line import/prefer-default-export
export { userInfo, userId, authCurrentStep };
