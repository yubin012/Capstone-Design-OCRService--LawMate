import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AgreementSection from '@/components/AgreementSection';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { toast } from 'react-toastify';

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // ❗ 백엔드 미사용 필드
  const [address, setAddress] = useState(''); // ❗ 백엔드 미사용 필드
  const [detailAddress, setDetailAddress] = useState('');
  const [birthdate, setBirthdate] = useState(''); // ❗ 백엔드 미사용 필드
  const [gender, setGender] = useState(''); // ❗ 백엔드 미사용 필드
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
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    setPasswordValid(passwordRegex.test(password));
  }, [password]);

  useEffect(() => {
    const agreed = agreementsChecked['terms'] && agreementsChecked['privacy'] && agreementsChecked['thirdparty'];
    setRequiredAgreed(agreed);
  }, [agreementsChecked]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setEmailExists(false);

    if (!name || !email || !password || !confirmPassword) {
      setError('이름, 이메일, 비밀번호는 필수 항목입니다.');
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
      console.log('회원가입 성공');
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
          <input
            type="email"
            placeholder="example@gmail.com"
            className="border p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailExists && (
            <p className="text-red-500 text-sm">이미 사용 중인 이메일입니다.</p>
          )}
        </div>

        {/* ❗ 사용하지 않는 필드들 (백엔드 DTO에는 없음) */}
        <div>
          <label className="text-black text-sm">전화번호</label>
          <input type="tel" placeholder="휴대폰 번호 입력 ('-' 제외 11자리)" className="border p-2 rounded w-full" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <input
          type="text"
          placeholder="주소 검색"
          className="border p-2 rounded w-full cursor-pointer bg-white"
          value={address}
          onClick={() => setIsPostcodeOpen(true)}
          readOnly
        />
        <input
          type="text"
          placeholder="Ex: 101동 202호"
          className="border p-2 rounded w-full mt-1"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />

        <div>
          <label className="text-black text-sm">생년월일</label>
          <input
            type="date"
            className={`border p-2 rounded w-full text-black ${!birthdate && 'text-transparent'}`}
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
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
          <p className={`text-sm ${!passwordValid && passwordTouched ? 'text-red-500' : 'text-gray-500'}`}>
            비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.
          </p>
        </div>

        <div>
          <label className="text-black text-sm">비밀번호 확인</label>
          <input type="password" placeholder="비밀번호 확인을 위해 다시 입력해주세요" className="border p-2 rounded w-full" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        <AgreementSection checked={agreementsChecked} setChecked={setAgreementsChecked} />

        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">회원가입</button>
      </form>

      {isPostcodeOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setIsPostcodeOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-[90%] max-w-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setIsPostcodeOpen(false)}
                className="text-gray-500 hover:text-red-500 text-xl"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <DaumPostcode
              onComplete={handleAddressComplete}
              autoClose
              style={{ width: '100%', height: '400px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
