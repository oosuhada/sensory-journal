import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';

import BottomNavigation from '@/components/BottomNavigation';

type SensoryCategory = 'wine' | 'beer' | 'coffee' | 'tea' | 'fragrance' | 'candle';

type SensoryRecord = {
  id: string;
  category: SensoryCategory;
  title: string;
  note: string;
  createdAt: string;
  scores: {
    fresh: number;
    sweet: number;
    woody: number;
    floral: number;
    earthy: number;
  };
};

const STORAGE_KEY = 'sensory-journal.records.v1';

const CATEGORY_LABEL: Record<SensoryCategory, string> = {
  wine: '와인',
  beer: '맥주',
  coffee: '커피',
  tea: '차',
  fragrance: '향수',
  candle: '캔들',
};

const SCORE_LABEL: Record<keyof SensoryRecord['scores'], string> = {
  fresh: 'Fresh',
  sweet: 'Sweet',
  woody: 'Woody',
  floral: 'Floral',
  earthy: 'Earthy',
};

const DEFAULT_SCORES: SensoryRecord['scores'] = {
  fresh: 3,
  sweet: 3,
  woody: 3,
  floral: 3,
  earthy: 3,
};

export default function SensoryJournalPage() {
  const [records, setRecords] = useState<SensoryRecord[]>([]);
  const [category, setCategory] = useState<SensoryCategory>('wine');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [scores, setScores] = useState<SensoryRecord['scores']>(DEFAULT_SCORES);

  useEffect(() => {
    const savedRecords = window.localStorage.getItem(STORAGE_KEY);
    if (!savedRecords) return;

    try {
      setRecords(JSON.parse(savedRecords) as SensoryRecord[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const profile = useMemo(() => {
    const keys = Object.keys(DEFAULT_SCORES) as Array<keyof SensoryRecord['scores']>;

    return keys.map((key) => {
      const total = records.reduce((sum, record) => sum + record.scores[key], 0);
      const average = records.length === 0 ? 0 : total / records.length;

      return {
        key,
        label: SCORE_LABEL[key],
        average,
      };
    });
  }, [records]);

  const strongestPreference = [...profile].sort((a, b) => b.average - a.average)[0];

  const saveRecord = () => {
    if (!title.trim()) return;

    const nextRecord: SensoryRecord = {
      id: `${Date.now()}`,
      category,
      title: title.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
      scores,
    };

    const nextRecords = [nextRecord, ...records];
    setRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    setTitle('');
    setNote('');
    setScores(DEFAULT_SCORES);
  };

  const removeRecord = (id: string) => {
    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
  };

  return (
    <Page>
      <Hero>
        <Eyebrow>SENSORY JOURNAL</Eyebrow>
        <h1>취향을 별점이 아니라 감각으로 기록하세요.</h1>
        <p>
          와인, 맥주, 커피, 차, 향수와 캔들까지 같은 감각 축으로 남기고 시간이 지날수록 나만의 취향 지도를 만듭니다.
        </p>
      </Hero>

      <Section>
        <SectionHeader>
          <div>
            <small>NEW MEMORY</small>
            <h2>오늘의 감각 기록</h2>
          </div>
          <CountBadge>{records.length} records</CountBadge>
        </SectionHeader>

        <CategoryGrid>
          {(Object.keys(CATEGORY_LABEL) as SensoryCategory[]).map((item) => (
            <CategoryButton
              key={item}
              type="button"
              active={category === item}
              onClick={() => setCategory(item)}
            >
              {CATEGORY_LABEL[item]}
            </CategoryButton>
          ))}
        </CategoryGrid>

        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="무엇을 경험했나요? 예: Bourgogne Pinot Noir"
        />

        <ScoreList>
          {(Object.keys(scores) as Array<keyof SensoryRecord['scores']>).map((key) => (
            <ScoreRow key={key}>
              <div>
                <strong>{SCORE_LABEL[key]}</strong>
                <span>{scores[key]} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={scores[key]}
                onChange={(event) =>
                  setScores((current) => ({
                    ...current,
                    [key]: Number(event.target.value),
                  }))
                }
              />
            </ScoreRow>
          ))}
        </ScoreList>

        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="향, 질감, 온도, 장소, 함께한 사람처럼 기억하고 싶은 감각을 자유롭게 적어보세요."
        />

        <SaveButton type="button" disabled={!title.trim()} onClick={saveRecord}>
          감각 기록 저장하기
        </SaveButton>
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <small>YOUR PROFILE</small>
            <h2>취향 프로필</h2>
          </div>
        </SectionHeader>

        {records.length === 0 ? (
          <EmptyState>첫 기록을 남기면 감각 축별 취향이 이곳에 쌓입니다.</EmptyState>
        ) : (
          <>
            <Insight>
              현재 기록에서는 <strong>{strongestPreference?.label}</strong> 성향이 가장 강하게 나타납니다. 더 다양한 카테고리를
              기록할수록 프로필이 정교해집니다.
            </Insight>
            <ProfileList>
              {profile.map((item) => (
                <ProfileRow key={item.key}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.average.toFixed(1)}</span>
                  </div>
                  <Bar>
                    <BarFill width={(item.average / 5) * 100} />
                  </Bar>
                </ProfileRow>
              ))}
            </ProfileList>
          </>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <small>MEMORY LOG</small>
            <h2>최근 기록</h2>
          </div>
        </SectionHeader>

        {records.length === 0 ? (
          <EmptyState>아직 저장된 기록이 없습니다.</EmptyState>
        ) : (
          <RecordList>
            {records.slice(0, 12).map((record) => (
              <RecordCard key={record.id}>
                <div>
                  <RecordMeta>
                    {CATEGORY_LABEL[record.category]} · {new Date(record.createdAt).toLocaleDateString('ko-KR')}
                  </RecordMeta>
                  <h3>{record.title}</h3>
                  {record.note && <p>{record.note}</p>}
                </div>
                <button type="button" onClick={() => removeRecord(record.id)}>
                  삭제
                </button>
              </RecordCard>
            ))}
          </RecordList>
        )}
      </Section>

      <BottomNavigation />
    </Page>
  );
}

const Page = styled.main`
  min-height: 100vh;
  padding: 32px 20px 20px;
  background: ${({ theme }) => theme.semanticColor.background};
  color: white;
`;

const Hero = styled.header`
  padding: 20px 4px 30px;

  h1 {
    margin: 8px 0 12px;
    font-size: 32px;
    line-height: 1.2;
    letter-spacing: -0.04em;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.64);
    font-size: 14px;
    line-height: 1.7;
  }
`;

const Eyebrow = styled.span`
  color: #f5c451;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
`;

const Section = styled.section`
  margin-bottom: 18px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;

  small {
    color: rgba(255, 255, 255, 0.42);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
  }

  h2 {
    margin: 4px 0 0;
    font-size: 20px;
  }
`;

const CountBadge = styled.span`
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(245, 196, 81, 0.12);
  color: #f5c451;
  font-size: 11px;
  font-weight: 700;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
`;

const CategoryButton = styled.button<{ active: boolean }>`
  min-height: 42px;
  border: 1px solid ${({ active }) => (active ? '#f5c451' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 12px;
  background: ${({ active }) => (active ? 'rgba(245, 196, 81, 0.14)' : 'rgba(255, 255, 255, 0.02)')};
  color: ${({ active }) => (active ? '#f5c451' : 'rgba(255, 255, 255, 0.72)')};
  font-weight: 700;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  outline: none;
  background: rgba(0, 0, 0, 0.18);
  color: white;

  &::placeholder {
    color: rgba(255, 255, 255, 0.32);
  }
`;

const ScoreList = styled.div`
  display: grid;
  gap: 12px;
  margin: 18px 0;
`;

const ScoreRow = styled.label`
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: center;
  gap: 14px;

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    font-size: 13px;
  }

  span {
    color: rgba(255, 255, 255, 0.42);
    font-size: 10px;
  }

  input {
    width: 100%;
    accent-color: #f5c451;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 96px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  outline: none;
  resize: vertical;
  background: rgba(0, 0, 0, 0.18);
  color: white;
  line-height: 1.6;

  &::placeholder {
    color: rgba(255, 255, 255, 0.32);
  }
`;

const SaveButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 12px;
  border: 0;
  border-radius: 16px;
  background: #f5c451;
  color: #181611;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const Insight = styled.div`
  margin-bottom: 18px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(245, 196, 81, 0.1);
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  line-height: 1.6;

  strong {
    color: #f5c451;
  }
`;

const ProfileList = styled.div`
  display: grid;
  gap: 14px;
`;

const ProfileRow = styled.div`
  div:first-of-type {
    display: flex;
    justify-content: space-between;
    margin-bottom: 7px;
  }

  strong,
  span {
    font-size: 12px;
  }

  span {
    color: rgba(255, 255, 255, 0.48);
  }
`;

const Bar = styled.div`
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
`;

const BarFill = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  height: 100%;
  border-radius: inherit;
  background: #f5c451;
`;

const EmptyState = styled.div`
  padding: 22px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
  color: rgba(255, 255, 255, 0.44);
  font-size: 13px;
  text-align: center;
`;

const RecordList = styled.div`
  display: grid;
  gap: 10px;
`;

const RecordCard = styled.article`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.16);

  h3 {
    margin: 4px 0;
    font-size: 15px;
  }

  p {
    margin: 6px 0 0;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    line-height: 1.5;
  }

  button {
    flex: none;
    border: 0;
    background: transparent;
    color: rgba(255, 255, 255, 0.32);
    font-size: 11px;
    cursor: pointer;
  }
`;

const RecordMeta = styled.div`
  color: #f5c451;
  font-size: 10px;
  font-weight: 700;
`;
