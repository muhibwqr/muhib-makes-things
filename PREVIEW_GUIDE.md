# How to Add Preview Images/Videos

## Quick Guide

To add your own preview images or videos to dock icons or project cards:

### For Dock Icons

1. **Add your image/video to the `public` folder:**
   ```bash
   # Example: Copy your file to public folder
   cp ~/Downloads/my-preview.png /Users/muhibwaqar/muhib-makes-things/public/
   ```

2. **Update the dock item in `src/pages/Index.tsx` or `src/pages/Projects.tsx`:**
   ```typescript
   {
     icon: <YourIcon size={18} />,
     label: 'Your Label',
     onClick: () => window.open('your-url', '_blank'),
     previewImage: '/your-image.png',  // For images
     // OR
     previewVideo: '/your-video.mp4', // For videos
     previewAlt: 'Description of preview'
   }
   ```

### For Project Cards

1. **Add your preview to the `public` folder:**
   ```bash
   cp ~/Downloads/project-preview.mp4 /Users/muhibwaqar/muhib-makes-things/public/
   ```

2. **Update the project in `src/components/Projects.tsx`:**
   ```typescript
   {
     title: "Your Project",
     description: "Your description",
     stack: "tech stack",
     link: "https://your-link.com",
     previewVideo: "/your-preview.mp4"  // For videos
     // OR
     previewImage: "/your-preview.png"  // For images
   }
   ```

## Supported Formats

- **Images**: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`
- **Videos**: `.mp4`, `.webm`, `.mov`

## File Naming Tips

- Use descriptive names: `linkedin-preview.mp4`, `goosetype-preview.png`
- Keep file sizes reasonable for web (images < 2MB, videos < 50MB recommended)
- Use lowercase and hyphens for consistency

## Example Workflow

1. Save your screenshot/video to Downloads
2. Copy to public folder:
   ```bash
   cp ~/Downloads/my-file.mp4 public/my-preview.mp4
   ```
3. Update the code with the path: `previewVideo: '/my-preview.mp4'`
4. Refresh your browser - the preview should appear on hover!

