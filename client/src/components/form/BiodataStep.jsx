import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { HiOutlineCamera, HiOutlineXMark } from 'react-icons/hi2'
import { uploadApi } from '../../api/client'
import toast from 'react-hot-toast'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function PhotoUpload({ label, value, onChange, id }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const { data } = await uploadApi.uploadPhoto(file)
      onChange(data.path)
      toast.success(`${label} uploaded`)
    } catch {
      toast.error('Upload failed. Please try again.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }, [label, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  })

  const clear = (e) => {
    e.stopPropagation()
    setPreview(null)
    onChange('')
  }

  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-1.5">{label}</label>
      <div
        {...getRootProps()}
        className={`
          relative flex flex-col items-center justify-center w-full h-40
          border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-border-subtle bg-white hover:border-navy-300'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} id={id} />
        {preview || value ? (
          <>
            <img
              src={preview || value}
              alt={label}
              className="w-24 h-24 object-cover rounded-xl"
            />
            <button onClick={clear} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-red-50">
              <HiOutlineXMark className="w-4 h-4 text-red-500" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-navy-400">
            <HiOutlineCamera className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">
              {uploading ? 'Uploading...' : 'Drop or click to upload'}
            </span>
            <span className="text-xs mt-1">JPG, PNG, WebP (max 5MB)</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BiodataStep({ data, onChange, errors }) {
  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    onChange({ ...data, [field]: value })
  }

  const fieldClass = (field) => `
    w-full px-4 py-3 text-sm text-navy-900 bg-white
    border rounded-xl transition-all duration-200
    placeholder:text-navy-400
    focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
    ${errors[field] ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-border-subtle'}
  `

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Personal Information
        </h2>
        <p className="mt-2 text-navy-500">
          Tell us about yourself. This information helps build your profile.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        {/* Name */}
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-navy-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={update('name')}
            placeholder="Enter your full name"
            className={fieldClass('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={update('email')}
            placeholder="your@email.com"
            className={fieldClass('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-navy-700 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={update('phone')}
            placeholder="+91 9876543210"
            className={fieldClass('phone')}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* Secondary Phone */}
        <div>
          <label htmlFor="secondaryPhone" className="block text-sm font-medium text-navy-700 mb-1.5">
            Secondary Phone
          </label>
          <input
            id="secondaryPhone"
            type="tel"
            value={data.secondaryPhone}
            onChange={update('secondaryPhone')}
            placeholder="Optional"
            className={fieldClass('secondaryPhone')}
          />
        </div>

        {/* Club Name */}
        <div>
          <label htmlFor="clubName" className="block text-sm font-medium text-navy-700 mb-1.5">
            Club Name <span className="text-red-500">*</span>
          </label>
          <input
            id="clubName"
            type="text"
            value={data.clubName}
            onChange={update('clubName')}
            placeholder="Rotaract Club of..."
            className={fieldClass('clubName')}
          />
          {errors.clubName && <p className="mt-1 text-xs text-red-500">{errors.clubName}</p>}
        </div>

        {/* Rotary ID */}
        <div>
          <label htmlFor="rotaryId" className="block text-sm font-medium text-navy-700 mb-1.5">
            My Rotary ID <span className="text-red-500">*</span>
          </label>
          <input
            id="rotaryId"
            type="text"
            value={data.rotaryId}
            onChange={update('rotaryId')}
            placeholder="Your Rotary ID"
            className={fieldClass('rotaryId')}
          />
          {errors.rotaryId && <p className="mt-1 text-xs text-red-500">{errors.rotaryId}</p>}
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-navy-700 mb-1.5">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            id="age"
            type="number"
            min="18"
            max="35"
            value={data.age}
            onChange={update('age')}
            placeholder="18-35"
            className={fieldClass('age')}
          />
          {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-navy-700 mb-1.5">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={update('dateOfBirth')}
            className={fieldClass('dateOfBirth')}
          />
          {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
        </div>

        {/* Profession */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-navy-700 mb-1.5">
            Profession <span className="text-red-500">*</span>
          </label>
          <input
            id="profession"
            type="text"
            value={data.profession}
            onChange={update('profession')}
            placeholder="Your profession"
            className={fieldClass('profession')}
          />
          {errors.profession && <p className="mt-1 text-xs text-red-500">{errors.profession}</p>}
        </div>

        {/* Blood Group */}
        <div>
          <label htmlFor="bloodGroup" className="block text-sm font-medium text-navy-700 mb-1.5">
            Blood Group <span className="text-red-500">*</span>
          </label>
          <select
            id="bloodGroup"
            value={data.bloodGroup}
            onChange={update('bloodGroup')}
            className={fieldClass('bloodGroup')}
          >
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          {errors.bloodGroup && <p className="mt-1 text-xs text-red-500">{errors.bloodGroup}</p>}
        </div>

        {/* Willing to Donate */}
        <div className="flex items-center gap-3 pt-6">
          <input
            id="willingToDonate"
            type="checkbox"
            checked={data.willingToDonate}
            onChange={update('willingToDonate')}
            className="w-5 h-5 rounded-md border-border-subtle text-primary-600 focus:ring-primary-500/20"
          />
          <label htmlFor="willingToDonate" className="text-sm font-medium text-navy-700">
            Willing to donate blood
          </label>
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-navy-700 mb-1.5">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            rows={3}
            value={data.address}
            onChange={update('address')}
            placeholder="Your full address"
            className={fieldClass('address') + ' resize-none'}
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
        </div>

        {/* Past Positions */}
        <div className="sm:col-span-2">
          <label htmlFor="pastPositions" className="block text-sm font-medium text-navy-700 mb-1.5">
            Past Positions Held
          </label>
          <textarea
            id="pastPositions"
            rows={3}
            value={data.pastPositions}
            onChange={update('pastPositions')}
            placeholder="List your previous Rotaract roles (e.g., Club President 2024-25, Club Secretary 2023-24)"
            className={fieldClass('pastPositions') + ' resize-none'}
          />
        </div>

        {/* Hobbies */}
        <div className="sm:col-span-2">
          <label htmlFor="hobbies" className="block text-sm font-medium text-navy-700 mb-1.5">
            Hobbies & Interests
          </label>
          <input
            id="hobbies"
            type="text"
            value={data.hobbies}
            onChange={update('hobbies')}
            placeholder="Reading, sports, photography..."
            className={fieldClass('hobbies')}
          />
        </div>

        {/* Photos */}
        <PhotoUpload
          label="Professional Photo"
          id="professionalPhoto"
          value={data.professionalPhoto}
          onChange={(path) => onChange({ ...data, professionalPhoto: path })}
        />
        <PhotoUpload
          label="Casual Photo"
          id="casualPhoto"
          value={data.casualPhoto}
          onChange={(path) => onChange({ ...data, casualPhoto: path })}
        />
      </div>
    </motion.div>
  )
}
