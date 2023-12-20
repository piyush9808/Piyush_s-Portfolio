import React, { Suspense, useRef } from 'react'
import { useState } from 'react'
import { Ref } from 'react'
import emailjs from '@emailjs/browser'
import Fox from '../models/Fox'
import Loader from '../components/Loader'
import { Canvas } from '@react-three/fiber'
import Alert from '../components/Alert'
import useAlert from '../hooks/useAlert'

const Contact = () => {

    const handleFocus = () => setcurrentAnimation('walk');
    const handleBlur = () => setcurrentAnimation('idle');
    const [currentAnimation, setcurrentAnimation] = useState('idle')

    const formRef = useRef(null);
    const [form, setform] = useState({
        name: "", email: '',
        message: ''
    })
    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsloading(true);
        setcurrentAnimation('hit');
        emailjs.send(
            import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID, 
        {
            from_name: form.name,
            to_name: 'Piyush',
            from_email: form.email,
            to_email: 'piyushkumarsings@gmail.com',
            message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
        )
        .then(
        () => {
            setIsloading(false);
            showAlert({
                show: true,
                text: 'Message sent',
                type: 'success',
            });


            setTimeout(() => {
                hideAlert(false);
                setcurrentAnimation('idle');
                setform({
                    name: '',
                    emal: '',
                    message: '',
                });
            }, [3000]);
        }, 
        (error) => {
            setIsloading(false);
            console.log(error);
            setcurrentAnimation('idle');
            
            showAlert({
                show: true,
                text: 'My ears missed your good words',
                type: 'danger',
            });
        })
    }

    const [isloading, setIsloading] = useState(false);
    const { alert, showAlert, hideAlert } = useAlert();
    return (
        <section className="relative flex lg:flex-row flex-col max-container h-[100vh]">
            {alert.show && <Alert{...alert} />}

            <div className='flex-1 min-w-[50%] flex flex-col'>
                <h1 className='head-text'> Get in Touch </h1>
                <form className="w-full flex flex-col gap-7 mt-14"
                    onSubmit={handleSubmit}
                >
                    <label className='text-black-500 font-semibold'>
                        Name
                        <input
                            type='text'
                            name='name'
                            className='input'
                            placeholder='John'
                            required
                            value={form.name}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </label>

                    <label className='text-black-500 font-semibold'>
                        E-Mail
                        <input
                            type='email'
                            name='email'
                            className='input'
                            placeholder='rocketsingh@gmail.com'
                            required
                            value={form.email}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </label>
                    <label className='text-black-500 font-semibold'>
                        Your Message
                        <textarea
                            name='message'
                            rows='4'
                            className='textarea'
                            placeholder='Tell about your experience'
                            value={form.message}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </label>
                    <button
                        type='submit'
                        className='btn'
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={isloading}
                    >
                        {isloading ? 'Sending...' : 'Send Message '}
                    </button>
                </form>

            </div>
            <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
                <Canvas
                    camera={{
                        position: [0, 0, 5],
                        fov: 75,
                        near: 0.1,
                        far: 1000

                    }}
                >
                    <directionalLight
                        intensity={2}
                        position={[0, 0, 1]} />
                    <ambientLight
                        intensity={0.5}
                    />

                    <Suspense fallback={<Loader />}>
                        <Fox
                            currentAnimation={currentAnimation}
                            position={[0.5, .35, 0]}
                            rotation={[12.6, -0.6, 0]}
                            scale={[0.55, 0.55, 0.55]}

                        />
                    </Suspense>
                </Canvas>
            </div>
        </section>
    )
}

export default Contact