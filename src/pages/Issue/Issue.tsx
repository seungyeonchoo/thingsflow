import { useContext, useEffect, useRef, useState } from 'react';
import { IssueContext, loadingImg } from './IssueProvider';
import styled from 'styled-components';
import { getIssueList } from 'api/api';
import IssueBox from './IssueBox';

const Issue = () => {
  const issueURL = `/issues?state=open&sort=comments&page=`;
  const handleIssueList = useContext(IssueContext);
  const { setIssues } = handleIssueList;
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = () => setPageNum(prev => prev + 1);

  const getIssues = async (page: number) => {
    const response = await getIssueList(issueURL + page);
    setIssues(p => (page === 1 ? [...response] : [...p, ...response]));
    setLoading(true);
  };

  useEffect(() => {
    getIssues(pageNum);
  }, [pageNum]);

  useEffect(() => {
    if (loading) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) loadMore();
        },
        { threshold: 1 }
      );
      observer.observe(observerRef.current as Element);
    }
  }, [loading]);

  return (
    <IssueContainer>
      <IssueBox />
      <LoadImg src={loadingImg} alt="로딩중..." />
      <Observer ref={observerRef}> </Observer>
    </IssueContainer>
  );
};

export default Issue;

const IssueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Observer = styled.div`
  text-align: center;
  margin: 2rem;
`;
const LoadImg = styled.img`
  width: 30%;
`;
