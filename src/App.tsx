import { Button, notification } from 'antd'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Switch from './components/darkMode'
import Loader from './components/newEffect'
import Poster from './components/nodata'
import clientApi from './lib/axiosInstance'

interface Iuser {
	id: string
	name: string
	email: string
	avatar: string
}

function App() {
	const notify = () => toast('Delete!!!')

	const [data, setData] = useState<Iuser[]>([])
	const [formData, setFormData] = useState({ name: '', email: '' })
	const [file, setFile] = useState<File | null>(null)
	const [isEditMode, setIsEditMode] = useState(false)
	const [editId, setEditId] = useState<string | null>(null)

	async function getCard() {
		const res = await clientApi.get('/api/n1/name')
		if (res.data) {
			setData(res.data)
		}
	}

	useEffect(() => {
		getCard()
	}, [])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null
		setFile(selectedFile)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			if (file) {
				const form = new FormData()
				form.append('name', formData.name)
				form.append('email', formData.email)
				form.append('file', file)

				if (isEditMode && editId) {
					await clientApi.put(`/api/n1/name/${editId}`, form)
					toast.success('Tahrirlash muvaffaqiyatli!')
				} else {
					await clientApi.post('/api/n1/name', form)
					toast.success("Ma'lumot qo'shildi!")
				}
			} else {
				if (isEditMode && editId) {
					await clientApi.put(`/api/n1/name/${editId}`, formData)
					toast.success('Tahrirlash muvaffaqiyatli!')
				} else {
					await clientApi.post('/api/n1/name', formData)
					toast.success("Ma'lumot qo'shildi!")
				}
			}

			setFormData({ name: '', email: '' })
			setFile(null)
			setIsEditMode(false)
			setEditId(null)
			getCard()
		} catch (error) {
			console.error('Xatolik yuz berdi:', error)
		}
	}

	const deleteF = async (id: string) => {
		try {
			await clientApi.delete(`/api/n1/name/${id}`)
			notification.success({
				message: 'Muvaffaqiyatli!',
				description: 'Ma’lumot muvaffaqiyatli o‘chirildi.',
				placement: 'topRight',
			})
			getCard()
		} catch (error) {
			console.error("O'chirishda xatolik:", error)
		}
	}

	const startEdit = (user: Iuser) => {
		setFormData({ name: user.name, email: user.email })
		setEditId(user.id)
		setIsEditMode(true)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<div>
			<ToastContainer />
			<div className='container min-h-[800px]'>
				<div className='w-full flex justify-between items-center py-5'>
					<Loader />
					<Switch />
				</div>

				<div className='w-full h-[600px] flex justify-center items-center'>
					<form
						onSubmit={handleSubmit}
						className='flex flex-col gap-5 border p-5 rounded-lg dark:border-white/20'
					>
						<h1 className='text-2xl font-bold text-center dark:text-white'>
							{isEditMode ? 'Hodimni Tahrirlash' : 'Yangi Hodim Qo‘shish'}
						</h1>

						<input
							required
							autoComplete='off'
							type='text'
							name='name'
							value={formData.name}
							onChange={handleChange}
							placeholder='Ism'
							className='border rounded p-2 dark:bg-black dark:text-white'
						/>

						<input
							required
							autoComplete='off'
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							placeholder='Email'
							className='border rounded p-2 dark:bg-black dark:text-white'
						/>

						<input
							type='file'
							onChange={handleFileChange}
							className='border rounded p-2 dark:bg-black dark:text-white'
						/>

						<button
							type='submit'
							className='bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'
						>
							{isEditMode ? 'Tahrirlash' : 'Qo‘shish'}
						</button>
					</form>
				</div>
			</div>
			<ToastContainer />

			<div className='container min-h-[400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10'>
				{data.length > 0 ? (
					data.map(item => (
						<div key={item.id}>
							<div className='border w-full h-[300px] rounded-2xl overflow-hidden p-5 flex flex-col items-center justify-between dark:border-white/20'>
								<div className='h-[180px] w-full flex justify-between items-start gap-[5px] flex-col'>
									<img
										src={item.avatar}
										alt=''
										className='h-[70px] w-[70px] object-cover rounded-[50%] border border-black/20'
									/>
									<h2 className='font-bold text-[20px] text-black dark:text-white'>
										{item.name}
									</h2>
									<p className='text-black dark:text-white'>{item.email}</p>
								</div>
								<div className='w-full flex justify-between items-center'>
									<Button type='primary' onClick={() => startEdit(item)}>
										Tahrirlash
									</Button>

									<Button
										danger
										onClick={() => {
											deleteF(item.id), notify()
										}}
									>
										O'chirish
									</Button>
								</div>
							</div>
						</div>
					))
				) : (
					<div className='col-span-4 flex justify-center items-center'>
						<Poster />
					</div>
				)}
			</div>
		</div>
	)
}

export default App
