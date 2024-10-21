import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import CameraPage from './camera-page';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchSimilarAction, selectCameras, selectIsCamerasLoading } from '../../store/cameras-slice/cameras-slice';
import { hasId } from '../../utils';
import NotFoundPage from '../not-found-page/not-found-page';
import Spinner from '../../components/spinner/spinner';
import { fetchReviewsAction, resetReviews } from '../../store/reviews-slice.ts/reviews-slice';

function CameraPagePicker(): JSX.Element | null {
  const { id: idStr = '' } = useParams();
  const id = parseInt(idStr, 10);
  const dispatch = useAppDispatch();
  const isCamerasLoading = useAppSelector(selectIsCamerasLoading);

  const cameras = useAppSelector(selectCameras);
  const selectedCamera = cameras.find(hasId(id));

  useEffect(
    () => {
      if (isFinite(id)) {
        dispatch(fetchReviewsAction(id));
        dispatch(fetchSimilarAction(id));
      }
      return () => {
        dispatch(resetReviews());
      };
    },
    [id, dispatch],

  );

  if (!id) {
    return <NotFoundPage />;
  }

  if (isCamerasLoading) {
    return <Spinner />;
  }

  if (selectedCamera === undefined) {
    return <NotFoundPage />;
  }

  return <CameraPage {...selectedCamera} />;
}

export default CameraPagePicker;
