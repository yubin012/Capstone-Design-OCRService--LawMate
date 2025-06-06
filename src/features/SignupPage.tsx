import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AgreementSection from '@components/user/AgreementSection';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [agreementsChecked, setAgreementsChecked] = useState<Record<string, boolean>>({});
  const [requiredAgreed, setRequiredAgreed] = useState(false);

  // 이메일 중복 체크
  useEffect(() => {
    if (email) {
      const checkEmail = setTimeout(async () => {
        try {
          const res = await axios.post('/api/check-email', { email });
          setEmailExists(res.data.exists);
        } catch (err) {
          console.error('이메일 확인 중 오류', err);
        }
      }, 500);
      return () => clearTimeout(checkEmail);
    }
  }, [email]);

  // 비밀번호 유효성 검사
  useEffect(() => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    setPasswordValid(passwordRegex.test(password));
  }, [password]);

  // 약관 필수 동의 여부 검사
  useEffect(() => {
    const agreed = agreementsChecked['terms'] && agreementsChecked['privacy'] && agreementsChecked['thirdparty'];
    setRequiredAgreed(agreed);
  }, [agreementsChecked]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setEmailExists(false); // 이메일 중복 상태 초기화

    // 입력값 검증
    if (!name || !email || !password || !confirmPassword) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!passwordValid) {
      setError('비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.');
      return;
    }
    if (emailExists) {
      setError('이미 등록된 이메일입니다.');
      return;
    }
    if (!requiredAgreed) {
      setError('필수 약관에 동의해야 가입할 수 있습니다.');
      return;
    }

    try {
      await axios.post('/auth/signup', {
        name,
        email,
        password,
      });
      toast.success('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || '회원가입에 실패했습니다.';
        if (msg.includes('이미 가입된 메일')) {
          setEmailExists(true);
        }
        setError(msg);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md relative">
      <Link to="/" className="absolute top-4 left-4 text-black hover:underline">← 메인화면으로</Link>
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div>
          <label className="text-black text-sm">이름</label>
          <input
            type="text"
            placeholder="김ㅁㅁ"
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-black text-sm">이메일</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="border p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailExists && <p className="text-red-500 text-sm">이미 사용 중인 이메일입니다.</p>}
        </div>

        <div>
          <label className="text-black text-sm">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="border p-2 rounded w-full"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordTouched(true);
            }}
          />
          <p className={`text-sm ${!passwordValid && passwordTouched ? 'text-red-500' : 'text-gray-500'}`}>
            비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.
          </p>
        </div>

        <div>
          <label className="text-black text-sm">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 확인을 위해 다시 입력해주세요"
            className="border p-2 rounded w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <AgreementSection checked={agreementsChecked} setChecked={setAgreementsChecked} />

        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage;
