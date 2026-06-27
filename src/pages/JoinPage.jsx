import { useState } from 'react'
import { createClient } from '@sanity/client'
import '../styles/joinpage.css'

// Write client — separate from read client
const writeClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
})

const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const JoinPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    tier: '',
    city: '',
    bio: '',
    instagramHandle: '',
    experience: '',
    eventsCount: '',
    whatsappNumber: '',
    memberSince: new Date().getFullYear().toString(),
    languages: '',
    specialisations: '',
  })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleBioChange = (e) => {
    const text = e.target.value
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length

    if (wordCount <= 50) {
      setFormData({ ...formData, bio: text })
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const uploadToCloudinary = async (file) => {
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', CLOUDINARY_PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: 'POST', body: data }
    )

    if (!res.ok) {
      throw new Error('Failed to upload image. Please try a different photo.')
    }

    const json = await res.json()

    // Force the returned URL to be JPEG format regardless of original format
    // Cloudinary URL structure: .../upload/v123456/filename
    // We insert f_jpg,q_auto to force format conversion
    const url = json.secure_url
    const transformedUrl = url.replace('/upload/', '/upload/f_jpg,q_auto/')

    return transformedUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let photoUrl = ''
      if (photo) {
        photoUrl = await uploadToCloudinary(photo)
      }

      const artistDoc = {
        _type: 'artist',
        name: formData.name,
        category: formData.category,
        tier: formData.tier,
        city: formData.city,
        bio: formData.bio,
        instagramHandle: formData.instagramHandle,
        experience: formData.experience,
        eventsCount: formData.eventsCount,
        whatsappNumber: formData.whatsappNumber,
        memberSince: formData.memberSince,
        languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        specialisations: formData.specialisations.split(',').map(s => s.trim()).filter(Boolean),
        photoUrl: photoUrl || ''
      }

      await writeClient.create(artistDoc)
      setSubmitted(true)
    } catch (err) {
      console.error('Submission error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="join-success">
        <div className="join-success-card">
          <div className="join-success-icon">✓</div>
          <h2>Profile Submitted!</h2>
          <p>Thank you for joining PowerPack Community. Your profile is under review and will be live soon.</p>
          <a href="/" className="join-success-btn">Back to Home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="join-page">
      <div className="join-header">
        <h1>Join <span>PowerPack</span></h1>
        <p>Submit your profile and become part of India's premier artist community</p>
      </div>

      <form className="join-form" onSubmit={handleSubmit}>

        <div className="join-photo-upload">
          <div className="photo-preview">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className="photo-placeholder"
              style={{ display: photoPreview ? 'none' : 'flex' }}
            >
              {photo ? '✓ Photo selected' : 'Upload Photo'}
            </div>
          </div>
          <label className="photo-upload-btn">
            Choose Photo
            <input
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handlePhotoChange}
              hidden
            />
          </label>
        </div>

        <div className="join-grid">
          <div className="join-field">
            <label>Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
          </div>

          <div className="join-field">
            <label>WhatsApp Number *</label>
            <input type="text" inputMode="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="91XXXXXXXXXX" required />
          </div>

          <div className="join-field">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option value="Anchors">Anchor</option>
              <option value="DJs">DJ</option>
              <option value="Choreographers">Choreographer</option>
              <option value="Reel Creators">Reel Creator</option>
            </select>
          </div>

          <div className="join-field">
            <label>Tier *</label>
            <select name="tier" value={formData.tier} onChange={handleChange} required>
              <option value="">Select tier</option>
              <option value="Elite">Elite</option>
              <option value="Premium">Premium</option>
              <option value="Official">Official</option>
              <option value="Open">Open</option>
            </select>
          </div>

          <div className="join-field">
            <label>City *</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Your city" required />
          </div>

          <div className="join-field">
            <label>Instagram Handle</label>
            <input type="text" name="instagramHandle" value={formData.instagramHandle} onChange={handleChange} placeholder="@yourusername" />
          </div>

          <div className="join-field">
            <label>Experience (in years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 5"
              min="0"
            />
          </div>

          <div className="join-field">
            <label>Events Done</label>
            <input
              type="number"
              name="eventsCount"
              value={formData.eventsCount}
              onChange={handleChange}
              placeholder="e.g. 100"
              min="0"
            />
          </div>

          <div className="join-field full">
            <label>Languages (comma separated)</label>
            <input type="text" name="languages" value={formData.languages} onChange={handleChange} placeholder="Hindi, English, Gujarati" />
          </div>

          <div className="join-field full">
            <label>Specialisations (comma separated)</label>
            <input type="text" name="specialisations" value={formData.specialisations} onChange={handleChange} placeholder="Wedding, Corporate, Awards" />
          </div>

          <div className="join-field full">
            <label>Bio ({formData.bio.trim().split(/\s+/).filter(Boolean).length}/50 words)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleBioChange}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </div>

        {error && <div className="join-error">{error}</div>}

        <button type="submit" className="join-submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Profile'}
        </button>

      </form>
    </div>
  )
}

export default JoinPage
