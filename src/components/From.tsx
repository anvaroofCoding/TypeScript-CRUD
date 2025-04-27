import { useEffect, useState } from 'react'
import styled from 'styled-components'
import clientApi from '../lib/axiosInstance'

const Form = ({ id }: { id?: string }) => {
	const [formData, setFormData] = useState({ name: '', email: '' })
	const [file, setFile] = useState<File | null>(null)
	const [isEditMode, setIsEditMode] = useState(false)

	useEffect(() => {
		if (id) {
			fetchUser()
		}
	}, [id])

	const fetchUser = async () => {
		try {
			const res = await clientApi.get(`/api/n1/name/${id}`)
			setFormData({
				name: res.data.name,
				email: res.data.email,
			})
			setIsEditMode(true)
		} catch (error) {
			console.error('Malumotni olishda xatolik:', error)
		}
	}

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
				const data = new FormData()
				data.append('name', formData.name)
				data.append('email', formData.email)
				data.append('file', file)

				if (isEditMode && id) {
					const res = await clientApi.put(`/api/n1/name/${id}`, data)
					console.log('Tahrir muvaffaqiyatli:', res.data)
				} else {
					const res = await clientApi.post('/api/n1/name', data)
					console.log('Muvaffaqiyatli yuborildi:', res.data)
				}
			} else {
				if (isEditMode && id) {
					const res = await clientApi.put(`/api/n1/name/${id}`, formData)
					console.log('Tahrir muvaffaqiyatli:', res.data)
				} else {
					const res = await clientApi.post('/api/n1/name', formData)
					console.log('Muvaffaqiyatli yuborildi:', res.data)
				}
			}

			setFormData({ name: '', email: '' })
			setFile(null)
			setIsEditMode(false)
		} catch (error) {
			console.error('Xatolik yuz berdi:', error)
		}
	}

	return (
		<StyledWrapper>
			<div className='container'>
				<div className='heading'>
					{isEditMode ? 'Hodimni Tahrirlash:' : "Yangi Hodimlar Bo'limi:"}
				</div>
				<form className='form' onSubmit={handleSubmit}>
					<div className='input-field'>
						<input
							required
							autoComplete='off'
							type='text'
							name='name'
							id='username'
							value={formData.name}
							onChange={handleChange}
						/>
						<label htmlFor='username'>Full Name</label>
					</div>
					<div className='input-field'>
						<input
							required
							autoComplete='off'
							type='email'
							name='email'
							id='email'
							value={formData.email}
							onChange={handleChange}
						/>
						<label htmlFor='email'>Email</label>
					</div>
					<div className='input-field'>
						<input
							autoComplete='off'
							type='file'
							id='file'
							onChange={handleFileChange}
						/>
					</div>
					<div className='btn-container'>
						<button type='submit' className='btn'>
							{isEditMode ? 'Tahrirlash' : 'Submit'}
						</button>
					</div>
				</form>
			</div>
		</StyledWrapper>
	)
}

const StyledWrapper = styled.div`
	.container {
		border: solid 1px #8d8d8d;
		padding: 20px;
		border-radius: 20px;
		background-color: transparent;
	}
	.container .heading {
		font-size: 1.3rem;
		margin-bottom: 20px;
		font-weight: bolder;
	}
	.form {
		width: 700px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.form .btn-container {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.form .btn {
		padding: 10px 20px;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 3px;
		border-radius: 10px;
		border: solid 1px #1034aa;
		border-bottom: solid 1px #90c2ff;
		background: linear-gradient(135deg, #0034de, #006eff);
		color: #fff;
		font-weight: bolder;
		transition: all 0.2s ease;
		box-shadow: 0px 2px 3px #000d3848, inset 0px 4px 5px #0070f0,
			inset 0px -4px 5px #002cbb;
	}
	.form .btn:active {
		box-shadow: inset 0px 4px 5px #0070f0, inset 0px -4px 5px #002cbb;
		transform: scale(0.995);
	}
	.input-field {
		position: relative;
		color: #0034de;
	}
	.input-field label {
		position: absolute;
		color: #8d8d8d;
		pointer-events: none;
		background-color: transparent;
		left: 15px;
		transform: translateY(0.6rem);
		transition: all 0.3s ease;
	}
	.input-field input {
		padding: 10px 15px;
		font-size: 1rem;
		border-radius: 8px;
		border: solid 1px #8d8d8d;
		letter-spacing: 1px;
		width: 79%;
	}
	.input-field input:focus,
	.input-field input:valid {
		outline: none;
		border: solid 1px #0034de;
	}
	.input-field input:focus ~ label,
	.input-field input:valid ~ label {
		transform: translateY(-51%) translateX(-10px) scale(0.8);
		background-color: #fff;
		padding: 0px 5px;
		color: #0034de;
		font-weight: bold;
		letter-spacing: 1px;
		border: none;
		border-radius: 100px;
	}
`

export default Form
