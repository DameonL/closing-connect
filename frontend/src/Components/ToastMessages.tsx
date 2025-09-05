import { h } from "preact";
import { useState } from "preact/hooks";

type ToastMessage = { message: string; timeout: NodeJS.Timeout };

let toastMessages: ToastMessage[] = [];
let setToastMessages = (newMessages: ToastMessage[]) => {
    toastMessages = newMessages;
};

const toastMessager = {
    showToastMessage: (message: string) => {
        let newMessage = {
            message,
            timeout: setTimeout(() => {
                removeToastMessage(newMessage.timeout);
            }, 3000),
        };
        toastMessages.push(newMessage);
        setToastMessages([...toastMessages]);
    }
}


function removeToastMessage(timeout: NodeJS.Timeout) {
    const index = toastMessages.findIndex((x) => x.timeout === timeout);
    if (index > -1) {
        toastMessages.splice(index, 1);
        setToastMessages([...toastMessages]);
    }
}

export default function ToastMessages() {
    [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

    return <div class="toastContainer">
        {toastMessages.reverse().map((x, i) => (
            <div class="toastItem" key={i}>
                {x.message}
            </div>
        ))}
    </div>

}

export { toastMessager };
