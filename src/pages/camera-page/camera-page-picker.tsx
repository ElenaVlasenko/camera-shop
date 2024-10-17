import { useParams } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
// import { fetchQuestAction, resetQuestNotFound, selectIsQuestLoading, selectIsQuestNotFound, selectSelectedQuest } from '../../store/quest-slice/quest-slice';
import { useEffect } from 'react';
// import { selectErrorMessage } from '../../store/error-slice/error-slice';
// import ErrorPage from '../error-page/error-page';
// import NotFoundPage from '../not-found-page/not-found-page';
// import QuestPage from './quest-page';
// import Spinner from '../../components/spinner/spinner';

import CameraPage from './camera-page';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchCamerasAction, selectCameras, selectIsCamerasLoading } from '../../store/cameras-slice/cameras-slice';
import { hasId, isEmpty } from '../../utils';
import NotFoundPage from '../not-found-page/not-found-page';
import Spinner from '../../components/spinner/spinner';
import { fetchReviewsAction, resetReviews, selectDisplayedReviews } from '../../store/reviews-slice.ts/reviews-slice';

function CameraPagePicker(): JSX.Element | null {
  const { id: idStr = '' } = useParams();
  const id = parseInt(idStr, 10);
  const dispatch = useAppDispatch();
  const isCamerasLoading = useAppSelector(selectIsCamerasLoading);

  const cameras = useAppSelector(selectCameras);
  const selectedCamera = cameras.find(hasId(id));
  // const reviews = useAppSelector(selectReviews);
  // // console.log('reviews:', reviews)

  // const selectedQuest = useAppSelector(selectSelectedQuest);
  // const isSelectedQuestLoading = useAppSelector(selectIsQuestLoading);
  // const isSelectedQuestNotFound = useAppSelector(selectIsQuestNotFound);
  // const error = useAppSelector(selectErrorMessage);

  useEffect(
    () => {
      if (isFinite(id)) {
        dispatch(fetchReviewsAction(id));
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

  // if (error) {
  //   return <ErrorPage />;
  // }

  // return <ProductPage selectedProduct={selectedProduct} />;
  return <CameraPage {...selectedCamera} />;
}

export default CameraPagePicker;
