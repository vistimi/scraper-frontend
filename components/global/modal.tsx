import { Modal, Text, Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';

interface ImageEditorProps {
    display: boolean,
    message: string, 
}

export const ModalError = (props: ImageEditorProps): JSX.Element => {
    const [display, setDisplay] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
      setDisplay(props.display);
      setMessage(props.message);
    }, [props])
    

    const closeModal = () => {
        setDisplay(false);
    };

    return (
        <Modal closeButton aria-labelledby="modal-title" open={display} onClose={closeModal}>
                <Modal.Header>
                    <Text id="modal-title" b size={18}>
                        Error message
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onPress={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
    );
}