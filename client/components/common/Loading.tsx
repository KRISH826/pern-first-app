import { Spinner } from '../ui/spinner'

const Loading = () => {
    return (
        <div className='flex items-center justify-center h-screen'>
            <Spinner className='size-12 text-primary' />
        </div>
    )
}

export default Loading