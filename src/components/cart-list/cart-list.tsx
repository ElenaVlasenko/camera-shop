import { Camera, CameraCounts } from '../../types';
import CartListItem from './cart-list-item';

type Props = {
  cameras: Camera[];
  cameraCounts: CameraCounts;
  onItemDeleteClick: (camera: Camera) => void;
}

function CartList({ cameras, cameraCounts, onItemDeleteClick }: Props): JSX.Element {
  return (
    <ul className="basket__list">
      {cameras.map((camera) => <CartListItem key={camera.id} camera={camera} count={cameraCounts[camera.id] ?? 0} onItemDeleteClick={onItemDeleteClick} />)}
    </ul>
  );
}

export default CartList;
