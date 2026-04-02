import { createPortal } from 'react-dom';
import { PropsWithChildren } from 'react';

export default function Portal({ children }: PropsWithChildren) {
    if (typeof document === 'undefined') return null;
    return createPortal(children, document.body);
}
