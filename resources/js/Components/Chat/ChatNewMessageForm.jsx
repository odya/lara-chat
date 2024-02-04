import { Head, Link, useForm, router } from '@inertiajs/react';
import TextInput from "../TextInput";

export default function ChatNewMessageForm({ receiverUser }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        message: "",
    });

    const handleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(route("chat.post-message", receiverUser?.id), data)
            .then((response) => {})
            .catch(function (e) {
                if(e.response.status === 422) {
                    console.log(e.response.data.errors)
                }
            });

        reset("message");
    };

    return (
        <form className="flex items-center" onSubmit={handleSubmit}>
            <TextInput
                id="message"
                type="text"
                name="message"
                className="flex-1 rounded-l-md border border-gray-300 p-2"
                isFocused={true}
                value={data.message}
                onChange={handleChange}
                placeholder="Type a message..."
                required
            />
            <button className="rounded-r-md bg-blue-500 p-2 text-white">Send</button>
        </form>
    );
}
