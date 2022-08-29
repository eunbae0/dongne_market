import { atom } from 'recoil';
// import { recoilPersist } from 'recoil-persist';

// const { persistAtom } = recoilPersist({key: 'userId'});

const userInfo = atom({
  key: 'userInfo',
  default: {
    isLogin: false,
    uid: '',
    nickname: '',
  },
});

const userId = atom({
  key: 'userId',
  default: '',
});

const authCurrentStep = atom({
  key: 'authCurrentStep',
  default: 0,
  // effects_UNSTABLE: [persistAtom],
});
// eslint-disable-next-line import/prefer-default-export
export { userInfo, userId, authCurrentStep };
