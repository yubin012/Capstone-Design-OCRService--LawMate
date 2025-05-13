// ✅ SignupPage.tsx (생년월일 달력 유지 + 이메일 인증 + 주소 검색 닫기 + 상세주소)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AgreementSection from '@/components/AgreementSection';
import DaumPostcode, { Address } from 'react-daum-postcode';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [agreementsChecked, setAgreementsChecked] = useState<Record<string, boolean>>({});
  const [requiredAgreed, setRequiredAgreed] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

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

  useEffect(() => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    setPasswordValid(passwordRegex.test(password));
  }, [password]);

  useEffect(() => {
    const agreed = agreementsChecked['terms'] && agreementsChecked['privacy'] && agreementsChecked['thirdparty'];
    setRequiredAgreed(agreed);
  }, [agreementsChecked]);

  const handleSendVerification = async () => {
    try {
      const res = await axios.post('/api/send-code', { email });
      setIsEmailSent(true);
      setEmailCode(res.data.code); // 실제로는 서버에서 검증해야 함
      alert('인증 코드가 전송되었습니다. 메일함을 확인하세요.');
    } catch {
      alert('인증 코드 전송 실패');
    }
  };

  const handleVerifyCode = () => {
    if (inputCode === emailCode) {
      setIsEmailVerified(true);
      alert('이메일 인증 성공');
    } else {
      alert('인증 코드가 일치하지 않습니다.');
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !address || !birthdate || !gender || !password || !confirmPassword) {
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
    if (!isEmailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }
    if (!requiredAgreed) {
      setError('필수 약관에 동의해야 가입할 수 있습니다.');
      return;
    }

    try {
      await axios.post('/api/signup', {
        name,
        email,
        phone,
        address: `${address} ${detailAddress}`,
        birthdate,
        gender,
        password,
      });
      navigate('/login');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || '회원가입에 실패했습니다.');
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleAddressComplete = (data: Address) => {
    let fullAddress = data.address;
    if (data.addressType === 'R' && data.buildingName) {
      fullAddress += ` (${data.buildingName})`;
    }
    setAddress(fullAddress);
    setIsPostcodeOpen(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md relative">
      <Link to="/" className="absolute top-4 left-4 text-blue-600 hover:underline">← 메인화면으로</Link>
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div>
          <label className="text-black text-sm">이름</label>
          <input type="text" placeholder="김ㅁㅁ" className="border p-2 rounded w-full" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="text-black text-sm">이메일</label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="example@gmail.com"
              className="border p-2 rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isEmailVerified && (
              <button
                type="button"
                className="bg-gray-400 text-white px-3 py-2 rounded whitespace-nowrap"
                onClick={handleSendVerification}
              >
                인증코드 발송
              </button>
            )}
          </div>

          {!isEmailVerified && isEmailSent && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="인증 코드 입력"
                className="border p-2 rounded w-full"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={handleVerifyCode}
              >
                확인
              </button>
            </div>
          )}
          {emailExists && (
            <p className="text-red-500 text-sm">이미 사용 중인 이메일입니다.</p>
          )}
        </div>


        <div>
          <label className="text-black text-sm">전화번호</label>
          <input type="tel" placeholder="휴대폰 번호 입력 ('-' 제외 11자리)" className="border p-2 rounded w-full" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>


        <div>
          <label className="text-black text-sm">주소</label>
          <input type="text" placeholder="주소 검색" className="border p-2 rounded w-full cursor-pointer bg-white" value={address} onClick={() => setIsPostcodeOpen(true)} readOnly />
          {isPostcodeOpen && (
            <div className="relative z-50 mt-2 w-full bg-white border shadow-md">
              <button type="button" className="absolute top-1 right-2 text-lg" onClick={() => setIsPostcodeOpen(false)}>✕</button>
              <DaumPostcode onComplete={handleAddressComplete} autoClose style={{ width: '100%', height: '400px' }} />
            </div>
          )}
          <input type="text" placeholder="Ex: 101동 202호" className="border p-2 rounded w-full mt-1" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} />
        </div>


        <div>
          <label className="text-black text-sm">생년월일</label>
          <div className="relative">
            <input
              type="date"
              className={`border p-2 rounded w-full text-black ${!birthdate && 'text-transparent'}`}
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
            {!birthdate && (
              <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
                YYYY-MM-DD (달력 버튼 클릭 →)
              </span>
            )}
          </div>
        </div>


        <div>
          <label className="text-black text-sm">성별</label>
          <select className={`border p-2 rounded w-full ${!gender ? 'text-gray-400' : 'text-black'}`} value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="" disabled hidden>성별 선택</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>

        <div>
          <label className="text-black text-sm">비밀번호</label>
          <input type="password" placeholder="비밀번호를 입력해주세요" className="border p-2 rounded w-full" value={password} onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }} />
          <p className={`text-sm ${!passwordValid && passwordTouched ? 'text-red-500' : 'text-gray-500'}`}>비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.</p>
        </div>

        <div>
          <label className="text-black text-sm">비밀번호 확인</label>
          <input type="password" placeholder="비밀번호 확인을 위해 다시 입력해주세요" className="border p-2 rounded w-full" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        <AgreementSection checked={agreementsChecked} setChecked={setAgreementsChecked} />

        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage;
