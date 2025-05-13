import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getUserInfo } from '@/api/user';
import { isAuthenticated } from '@/utils/auth';

// ✅ 사용자 정보 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

// ✅ 접근 제어 모드 설정 (true면 로그인 필요 / false면 비로그인 허용)
const IS_PROTECTED_MODE = false; // <- 여기만 바꾸면 전체 동작 전환

// ✅ Context 생성
const UserContext = createContext<User | null>(null);

// ✅ Context 사용 훅
export const useUser = () => useContext(UserContext);

// ✅ Provider 컴포넌트
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (IS_PROTECTED_MODE) {
        // 로그인된 사용자 정보 불러오기
        if (!isAuthenticated()) return;
        try {
          const userInfo = await getUserInfo();
          setUser(userInfo);
        } catch (err) {
          console.error('❗ 유저 정보 로딩 실패:', err);
          setUser(null);
        }
      } else {
        // 테스트용 더미 계정 설정
        setUser({
          id: 'guest',
          name: '게스트',
          email: 'guest@example.com',
          joinedAt: new Date().toISOString(),
        });
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
