# St Paul's School Project Management Dashboard

**Version 2.0** | Educational Technology Department, São Paulo, Brazil

---

## 🌟 Overview

An exceptional, production-grade project management dashboard designed specifically for St Paul's School to track nine concurrent educational technology projects across their complete lifecycle. Features integrated SharePoint functionality, real-time analytics, and a stunning dynamic phase-responsive visual theming system.

## ✨ Key Features

### 1. **Dynamic Phase-Responsive Backgrounds**
- Automatic background transitions based on project completion percentage
- 7 distinct visual phases with unique particle effects:
  - **Inception** (0-5%): Particle coalescence from chaos
  - **Planning** (6-20%): Blueprint line animations
  - **Design** (21-40%): Creative brush strokes
  - **Development** (41-70%): Matrix code rain effect
  - **Testing** (71-85%): Quality assurance pulse waves
  - **Deployment** (86-95%): Rocket launch trajectory
  - **Complete** (96-100%): Celebration confetti burst
- Respects `prefers-reduced-motion` for accessibility

### 2. **Comprehensive Project Tracking**
- Real-time monitoring of 9 active projects
- Visual progress indicators with circular completion charts
- Time tracking: hours allocated, consumed, and remaining
- Burn rate calculations and projected completion dates
- RAG (Red/Amber/Green) status indicators
- Phase-based project management

### 3. **Advanced Analytics Dashboard**
- Aggregate metrics across all projects
- Total hours tracking and efficiency ratios
- Average completion percentages
- Projects on track vs at-risk analysis
- Visual data representations with animated charts

### 4. **Interactive Gantt Timeline**
- Canvas-based timeline visualization
- Monthly markers with grid overlays
- "Today" indicator for current date reference
- Progress bars showing completion status
- Phase-colored bars for visual differentiation

### 5. **SharePoint Integration Module**
- Quick page request submission interface
- Request tracking with unique IDs (format: SPS-YYYY-NNNN)
- Status management: Submitted → In Review → Approved → Published
- Priority levels and target audiences
- Request statistics dashboard

### 6. **Project Detail Views**
- Comprehensive project information modals
- Milestone tracking with completion indicators
- Time metrics and burn rate analysis
- Date tracking and priority management
- Projected completion calculations

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18.3+** with TypeScript
- **Tailwind CSS 4.0** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **Canvas API** for high-performance particle effects

### Backend Infrastructure
- **Supabase** for real-time data management
- **Hono** web framework on Supabase Edge Functions
- **Key-Value Store** for flexible data persistence
- RESTful API architecture

### Project Structure
```
/
├── App.tsx                          # Main dashboard component
├── components/
│   ├── AnalyticsSummary.tsx         # Aggregate analytics cards
│   ├── GanttChart.tsx               # Interactive timeline
│   ├── PhaseBackground.tsx          # Dynamic background system
│   ├── ProjectCard.tsx              # Individual project cards
│   ├── ProjectDetailModal.tsx       # Detailed project view
│   ├── SharePointPanel.tsx          # SharePoint request module
│   └── ui/                          # shadcn/ui components
├── utils/
│   ├── phaseCalculator.ts           # Phase determination logic
│   └── supabase/
│       └── client.ts                # Supabase client singleton
├── supabase/functions/server/
│   └── index.tsx                    # Backend API server
└── styles/
    └── globals.css                  # St Paul's brand colors
```

## 🎨 Design System

### St Paul's School Brand Colors
- **Indigo Blue**: `#001d31` (Primary)
- **Ruby Red**: `#820021` (Accent)
- **British Green**: `#002718` (Supporting)
- **Gold**: `#B8860B` (Highlight)

### Typography
- **Primary Font**: Inter (UI elements)
- **Monospace**: For numerical data
- Proper font feature settings for tabular figures

### Phase Colors
- Inception: `#1a1a2e` (Deep Space)
- Planning: `#16213e` (Navy)
- Design: `#c9184a` (Crimson)
- Development: `#004d00` (Forest Green)
- Testing: `#daa520` (Goldenrod)
- Deployment: `#0047AB` (Cobalt Blue)
- Complete: `#9370DB` (Medium Purple)

## 🚀 Getting Started

### Prerequisites
- Supabase project connected via Figma Make
- Modern browser with Canvas API support

### Initial Setup
The dashboard automatically initializes on first load:
1. Creates key-value store structure
2. Populates 9 initial projects with realistic data
3. Sets up project tracking infrastructure

### Using the Dashboard

#### Viewing Projects
- Browse all projects in the main grid view
- Click "View Full Details" to see comprehensive information
- Monitor progress with circular completion indicators
- Track time metrics and efficiency ratios

#### SharePoint Requests
1. Click "SharePoint" in the navigation bar
2. Fill out the new page request form:
   - Page title and purpose
   - Target audiences (multi-select)
   - Content description
   - Priority level
   - Optional publication date
3. Track request status in the panel

#### Analytics
- View aggregate statistics at a glance
- Monitor total hours across all projects
- Track average completion percentage
- Identify at-risk projects

## 📊 Initial Project Data

The system comes pre-loaded with 9 active projects:

1. **Paulean AI v2.0** - Mathematics Department (80% complete)
2. **Advanced Grades & Assessment System** - Academic Admin (65%)
3. **Form Three Portal** - Lower School (55%)
4. **Careers Guidance Platform** - Student Services (70%)
5. **Feedback & Lesson Observations v2** - Teaching & Learning (25%)
6. **IB Mathematics Resources Hub** - IB Programme (30%)
7. **Institutional Learning Management** - Whole School (20%)
8. **Educational Tools Suite** - Faculty Development (15%)
9. **School News & Communications** - Marketing & Comms (60%)

## 🎯 Performance Optimizations

### Canvas Rendering
- RequestAnimationFrame for smooth 60fps animations
- Efficient particle systems with object pooling
- Automatic cleanup on component unmount

### Accessibility
- WCAG 2.1 Level AA compliant color contrasts
- Respects reduced motion preferences
- Semantic HTML structure
- Keyboard navigation support

### Responsive Design
- Mobile-first approach
- Breakpoints: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)
- Fluid typography and spacing
- Touch-optimized interactions

## 🔧 API Endpoints

### Projects
- `GET /make-server-9c55f89c/projects` - Fetch all projects
- `GET /make-server-9c55f89c/projects/:code` - Get single project
- `PUT /make-server-9c55f89c/projects/:code` - Update project
- `POST /make-server-9c55f89c/init-database` - Initialize database

### SharePoint
- `GET /make-server-9c55f89c/sharepoint-requests` - Fetch all requests
- `POST /make-server-9c55f89c/sharepoint-requests` - Create new request
- `PUT /make-server-9c55f89c/sharepoint-requests/:id` - Update request

### Analytics
- `GET /make-server-9c55f89c/analytics` - Get aggregate analytics

## 🎨 Visual Showcase

### Dashboard Features
- **Live Phase Backgrounds**: Automatically transitions as projects progress
- **Glassmorphism Effects**: Semi-transparent panels with backdrop blur
- **Gradient Accents**: Beautiful color transitions throughout
- **Smooth Animations**: 60fps transitions for all interactive elements
- **Custom Illustrations**: St Paul's School branding integrated tastefully

## 🔐 Security Considerations

- All API calls authenticated with Supabase bearer tokens
- Protected server endpoints with proper authorization
- Input validation on all form submissions
- XSS prevention through React's built-in sanitization

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers: iOS Safari, Chrome Android

## 🎓 About St Paul's School

St Paul's School, São Paulo, Brazil is a leading educational institution committed to excellence in teaching and learning. This dashboard represents the school's dedication to leveraging cutting-edge educational technology to enhance the student and faculty experience.

## 👨‍💼 Project Owner

**Mr Nascimento, PhD**  
AI Solutions Developer  
St Paul's School, São Paulo, Brazil

---

**Dashboard Version 2.0** | Last Updated: October 2025  
*Delivering something extraordinary. Delivering something enviable. Delivering something impeccable.*
