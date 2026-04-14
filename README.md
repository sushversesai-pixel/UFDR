UFDR (Unified Force Directed Representation)**

```markdown
# 📊 UFDR - Unified Force Directed Representation

A powerful React-based visualization and data analysis platform using force-directed graphs. UFDR enables users to explore complex relationships, analyze network structures, and generate comprehensive reports.

## ✨ Features

- **Force-Directed Graph Visualization** - Interactive network visualization with physics simulation
- **Real-time Data Processing** - Process and analyze data on the fly
- **PDF Report Generation** - Export visualizations and analysis as PDF documents
- **Advanced Analytics** - Statistical analysis and insights
- **Dark Mode Support** - Theme switching for comfortable usage
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Firebase Integration** - Real-time data synchronization
- **Chart Components** - Multiple chart types for data visualization
- **Export Functionality** - Save graphs and reports in multiple formats

## 🛠 Tech Stack

- **Frontend**: React 19.2.4, TypeScript
- **Build Tool**: Vite 8.0.1
- **Visualization**: 
  - Force-Graph 1.51.2
  - React Force Graph 2D 1.29.1
  - Recharts 3.8.0
- **PDF Generation**: jsPDF 4.2.1
- **Routing**: React Router DOM 7.13.1
- **Database**: Firebase 12.11.0
- **UI Components**: Lucide React 0.577.0
- **Styling**: Tailwind CSS
- **Code Quality**: ESLint

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account (optional, for real-time features)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sushversesai-pixel/UFDR.git
   cd UFDR
Install dependencies:

bash
npm install
Configure Firebase (optional):

Create a .env file in the root directory
Add your Firebase credentials:
Code
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
Start the development server:

bash
npm run dev
Visit http://localhost:5173 in your browser

🔨 Development
Available Scripts
Development: npm run dev - Start dev server with hot reload
Build: npm run build - Build for production (includes TypeScript compilation)
Lint: npm run lint - Run ESLint to check code quality
Preview: npm run preview - Preview production build locally
📁 Project Structure
Code
UFDR/
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── services/          # Firebase and API services
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
├── package.json           # Dependencies
└── README.md              # Documentation
📊 Using Force-Directed Graphs
JavaScript
import ForceGraph2D from 'react-force-graph-2d';

const data = {
  nodes: [
    { id: 'node1', name: 'Node 1' },
    { id: 'node2', name: 'Node 2' },
  ],
  links: [
    { source: 'node1', target: 'node2' },
  ],
};

<ForceGraph2D graphData={data} />
📄 Generating PDF Reports
JavaScript
import jsPDF from 'jspdf';

const generateReport = () => {
  const doc = new jsPDF();
  doc.text('Analysis Report', 10, 10);
  doc.save('report.pdf');
};
🔐 Security Considerations
Environment variables for sensitive data
Input validation on all data
Secure Firebase rules configuration
XSS and CSRF protection
🚢 Deployment
Deploy to Firebase Hosting
bash
# Build the project
npm run build

# Deploy using Firebase CLI
firebase deploy
Deploy to Vercel
bash
vercel
🤝 Contributing
Fork the repository
Create a feature branch: git checkout -b feature/your-feature
Make your changes and commit: git commit -m "Add feature"
Run linter: npm run lint
Push to branch: git push origin feature/your-feature
Submit a pull request
📝 License
MIT License - See LICENSE file for details

👤 Author
Sai Susmitha
