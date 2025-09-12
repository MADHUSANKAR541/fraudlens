# FraudLens - Page Specifications

This document outlines the detailed specifications for each page in the FraudLens application. Each page is designed with a focus on user experience, accessibility, and professional banking-grade aesthetics.

## 🏠 Landing Page (`/(public-facing)/page.tsx`)

### Purpose
Introduce FraudLens to potential customers and drive conversions.

### Key Features
- **Hero Section**: Parallax background with animated elements
- **Feature Showcase**: 6 key features with icons and descriptions
- **Statistics**: Impressive numbers (99.7% accuracy, <1ms response time)
- **Testimonials**: Customer success stories
- **Call-to-Action**: Multiple conversion points

### Design Elements
- Gradient backgrounds (blue to teal)
- Floating particles animation
- Mouse-following effects
- Smooth scroll indicators
- Responsive grid layouts

### Animations
- Fade-in on scroll
- Staggered card animations
- Parallax scrolling
- Hover effects on buttons
- Loading animations

---

## 🔐 Authentication Pages

### Login Page (`/(auth)/login/page.tsx`)

#### Purpose
Secure user authentication with playful mascot interaction.

#### Key Features
- **Mascot Animation**: Eyes close when password is focused
- **Password Strength**: Real-time strength indicator
- **Social Login**: Google and Twitter integration
- **Remember Me**: Persistent login option
- **Forgot Password**: Recovery link

#### Form Validation
- Email format validation
- Password strength requirements
- Real-time feedback
- Error state handling

#### Mascot Behavior
- Auto-blink every 3-5 seconds
- Eyes close when password field is focused
- Eyes open when password field loses focus
- Floating particles around mascot

### Signup Page (`/(auth)/signup/page.tsx`)

#### Purpose
User registration with comprehensive validation.

#### Key Features
- **Multi-field Form**: First name, last name, email, company
- **Password Confirmation**: Real-time matching validation
- **Terms Agreement**: Required checkbox with links
- **Social Registration**: Alternative signup methods
- **Benefits List**: Free trial highlights

#### Validation Rules
- Name fields: Required, 2+ characters
- Email: Valid format, unique
- Password: 8+ chars, mixed case, numbers
- Company: Optional
- Terms: Must be accepted

---

## 📊 Dashboard (`/(dashboard)/page.tsx`)

### Purpose
Central hub for fraud detection monitoring and analytics.

### Layout Structure
- **Sidebar Navigation**: Collapsible on mobile
- **Top Header**: Search, filters, user menu
- **Main Content**: KPI cards, charts, alerts

### KPI Cards
1. **Total Transactions**: 2,847,392 (+12.5%)
2. **Fraud Detected**: 1,247 (-8.2%)
3. **False Positives**: 89 (-15.3%)
4. **Accuracy Rate**: 99.7% (+0.3%)

### Charts Section
- **Fraud Trend**: Line chart with time filters (7D, 30D, 90D)
- **Fraud Types**: Pie chart with distribution
- **Interactive Tooltips**: Detailed information on hover

### Recent Alerts
- **High Priority**: Red indicators
- **Medium Priority**: Yellow indicators
- **Low Priority**: Green indicators
- **Real-time Updates**: Live alert feed

### Responsive Behavior
- Mobile: Collapsible sidebar
- Tablet: Adjusted grid layouts
- Desktop: Full sidebar always visible

---

## 📤 Data Upload (`/(dashboard)/upload/page.tsx`)

### Purpose
Upload and validate transaction data for fraud analysis.

### Upload Interface
- **Drag & Drop Zone**: Visual feedback on hover
- **File Type Support**: CSV, Excel (.xlsx, .xls), JSON
- **Progress Tracking**: Real-time upload progress
- **Error Handling**: Clear error messages

### File Requirements
- **Size Limit**: 100MB maximum
- **Required Columns**: transaction_id, amount, timestamp, user_id
- **Data Validation**: Schema checking
- **Format Support**: Multiple file types

### Upload Process
1. **File Selection**: Drag-drop or click to browse
2. **Validation**: Schema and format checking
3. **Upload**: Progress tracking with status updates
4. **Processing**: Background analysis
5. **Results**: Success/error feedback

### Sidebar Features
- **Quick Actions**: Download template, view samples
- **Upload Statistics**: Success/failure counts
- **Next Steps**: Guided workflow

---

## 🔍 Fraud Detection (`/(dashboard)/detect/page.tsx`)

### Purpose
Display fraud detection results with detailed analysis.

### Results Table
- **Sortable Columns**: All major fields
- **Filtering**: Advanced search and filter options
- **Pagination**: Handle large datasets
- **Export Options**: CSV, Excel, PDF

### Risk Indicators
- **High Risk**: Red badges (>70% probability)
- **Medium Risk**: Yellow badges (30-70% probability)
- **Low Risk**: Green badges (<30% probability)

### Action Buttons
- **Investigate**: Detailed transaction view
- **Approve**: Mark as legitimate
- **Block**: Mark as fraud
- **Export**: Download results

### Batch Operations
- **Select All**: Bulk selection
- **Bulk Actions**: Mass approve/block
- **Filter by Risk**: Show only high-risk transactions

---

## 📊 Insights & Analytics (`/(dashboard)/insights/page.tsx`)

### Purpose
Comprehensive fraud analytics and visualizations.

### Chart Types
- **Time Series**: Fraud trends over time
- **Geographic**: Location-based fraud heatmap
- **Demographic**: User segment analysis
- **Merchant**: Merchant risk analysis

### Interactive Features
- **Date Range Picker**: Custom time periods
- **Filter Controls**: Multiple filter options
- **Drill-down**: Click to explore details
- **Export Charts**: Save as images

### Dashboard Widgets
- **Summary Cards**: Key metrics
- **Trend Lines**: Performance indicators
- **Distribution Charts**: Fraud type breakdown
- **Comparison Views**: Period-over-period

### Customization
- **Widget Layout**: Drag-and-drop arrangement
- **Chart Types**: Switch between visualizations
- **Color Schemes**: Custom color palettes
- **Saved Views**: Bookmark configurations

---

## 🧠 Explainability (`/(dashboard)/explain/page.tsx`)

### Purpose
Explain AI model decisions with transparent insights.

### SHAP Values
- **Feature Importance**: Bar chart visualization
- **Waterfall Plot**: Decision path explanation
- **Force Plot**: Individual prediction breakdown
- **Summary Plot**: Overall feature impact

### LIME Explanations
- **Local Interpretations**: Per-transaction explanations
- **Feature Weights**: Positive/negative contributions
- **Decision Boundaries**: Model decision regions
- **Confidence Scores**: Explanation reliability

### Interactive Features
- **Transaction Selector**: Choose specific transactions
- **Feature Toggle**: Show/hide features
- **Comparison Mode**: Compare multiple transactions
- **Export Explanations**: Save as reports

### Educational Content
- **Model Overview**: How the AI works
- **Feature Descriptions**: What each feature means
- **Decision Process**: Step-by-step explanation
- **Best Practices**: How to interpret results

---

## 🎯 What-If Analysis (`/(dashboard)/whatif/page.tsx`)

### Purpose
Simulate fraud scenarios and test different parameters.

### Scenario Builder
- **Parameter Sliders**: Adjust transaction values
- **Conditional Logic**: If-then scenarios
- **Template Library**: Pre-built scenarios
- **Custom Scenarios**: User-defined tests

### Simulation Engine
- **Real-time Updates**: Instant result updates
- **Batch Simulations**: Test multiple scenarios
- **Sensitivity Analysis**: Parameter impact studies
- **Monte Carlo**: Statistical simulations

### Results Visualization
- **Probability Changes**: Before/after comparisons
- **Risk Score Updates**: Dynamic risk calculations
- **Feature Impact**: Parameter influence
- **Confidence Intervals**: Uncertainty ranges

### Export Options
- **Scenario Reports**: Detailed analysis
- **Comparison Tables**: Side-by-side results
- **Visual Summaries**: Chart exports
- **API Integration**: Programmatic access

---

## 🚨 Alerts & Reports (`/(dashboard)/alerts/page.tsx`)

### Purpose
Manage fraud alerts and generate comprehensive reports.

### Alert Management
- **Real-time Feed**: Live alert stream
- **Priority Levels**: High, medium, low classifications
- **Status Tracking**: New, reviewed, resolved
- **Bulk Actions**: Mass alert management

### Report Generation
- **Scheduled Reports**: Automated delivery
- **Custom Reports**: User-defined templates
- **Export Formats**: PDF, Excel, CSV
- **Email Integration**: Direct delivery

### Alert Rules
- **Custom Rules**: User-defined conditions
- **Threshold Management**: Adjustable limits
- **Notification Channels**: Email, SMS, webhook
- **Rule Testing**: Validate before activation

### Analytics
- **Alert Trends**: Volume and patterns
- **Response Times**: Performance metrics
- **False Positive Rates**: Accuracy tracking
- **Team Performance**: Analyst statistics

---

## 👥 About & Team (`/(dashboard)/about/page.tsx`)

### Purpose
Company information, team profiles, and contact details.

### Company Section
- **Mission Statement**: FraudLens purpose
- **Vision**: Future goals and objectives
- **Values**: Core principles
- **History**: Company timeline

### Team Profiles
- **Leadership**: Executive team
- **Engineering**: Development team
- **Data Science**: ML/AI specialists
- **Support**: Customer success team

### Contact Information
- **Support Channels**: Multiple contact methods
- **Office Locations**: Physical addresses
- **Social Media**: Company profiles
- **Newsletter**: Subscription signup

### Resources
- **Documentation**: Help and guides
- **Blog**: Latest updates
- **Case Studies**: Success stories
- **White Papers**: Technical resources

---

## 🎨 Design Guidelines

### Color System
- **Primary**: Navy (#0D1B2A), Blue (#1565C0)
- **Secondary**: Teal (#00BFA6)
- **Accent**: Red (#FF5252) for alerts
- **Neutral**: Comprehensive gray scale

### Typography
- **Headings**: Inter Bold (600-800 weight)
- **Body**: Inter Regular (400 weight)
- **Code**: JetBrains Mono (400-600 weight)

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Common Spacing**: 8px, 16px, 24px, 32px
- **Component Padding**: 16px-24px
- **Section Margins**: 32px-48px

### Animations
- **Duration**: 200ms-600ms
- **Easing**: ease-out for entrances, ease-in for exits
- **Stagger**: 100ms delays for lists
- **Hover**: 200ms transitions

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

---

## 🔧 Technical Requirements

### Performance
- **Page Load**: < 3 seconds
- **Time to Interactive**: < 5 seconds
- **Lighthouse Score**: > 90
- **Core Web Vitals**: All green

### Accessibility
- **WCAG 2.1 AA**: Full compliance
- **Keyboard Navigation**: Complete support
- **Screen Readers**: ARIA labels
- **Color Contrast**: 4.5:1 minimum

### Browser Support
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Mobile Support
- **iOS**: 12+ Safari
- **Android**: 8+ Chrome
- **Touch Gestures**: Swipe, pinch, tap
- **Responsive Design**: Mobile-first approach

---

*This document will be updated as new features are added and requirements evolve.*
