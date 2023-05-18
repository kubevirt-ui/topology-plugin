import { useSelector } from 'react-redux';

export const useOverviewMetrics = () => {
  return useSelector((state: RootState) => state.UI.getIn(['overview', 'metrics']));
};
