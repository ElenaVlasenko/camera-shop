import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/hooks';
import { resetErrorMessage } from '../../store/error-slice/error-slice';

function ErrorPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleClick() {
    dispatch(resetErrorMessage());
    navigate(0);
  }

  return (
    <>
      <h1>System error:</h1>
      <Link onClick={handleClick} to='' >Go to main page</Link>
    </>
  );
}

export default ErrorPage;
