import { cloneElement, isValidElement, ReactElement, useState } from 'react';
import Modal from '@mui/joy/Modal';
import { ChildrenAsProps } from '../types';

export default function ImageModal({ children: imageElement }: ChildrenAsProps) {
  const [open, setOpen] = useState<boolean>(false);

  let imageSrc = '';
  if (isValidElement(imageElement)) imageSrc = imageElement.props.src;
  const imageChildModified = cloneElement(imageElement as ReactElement, {
    onClick: () => setOpen(true),
  });

  return (
    <>
      {imageChildModified}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <img style={{ maxWidth: "85%", maxHeight: "80%", }} src={imageSrc} alt="image expanded" />
      </Modal>
    </>
  );
}
