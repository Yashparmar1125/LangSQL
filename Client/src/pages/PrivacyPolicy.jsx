import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, UserCheck, Key, Database, RefreshCw, Mail } from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <LandingNavbar />

      <div className="pt-24 pb-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0A0A0B] dark:via-[#0D0D0F] dark:to-[#111113]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
        >
          {/* Header */}
          <div className="relative text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-[#00E5FF]/10 border border-blue-500/20 dark:border-[#00E5FF]/20 text-xs font-semibold text-blue-600 dark:text-[#00E5FF]">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Privacy Policy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Effective Date: March 10, 2025 | Domain: https://langsql.yashparmar.in
            </p>
          </div>

          {/* Core Content Card */}
          <div className="bg-white/80 dark:bg-[#111113]/80 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-6 sm:p-10 shadow-xl space-y-8 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                1. Introduction & Ownership
              </h2>
              <p>
                This Privacy Policy governs the manner in which <strong>LangSQL</strong> ("the Application", "we", "us", or "our", operated by Yash Parmar at <span className="text-blue-600 dark:text-[#00E5FF] font-medium">https://langsql.yashparmar.in</span>) collects, uses, maintains, and discloses information collected from users ("User", "you") of the LangSQL website and software service.
              </p>
              <p>
                By signing in, accessing, or creating database connections on LangSQL, you acknowledge that you have read and agreed to the practices described in this document.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                2. User Account Data & Google OAuth Scopes
              </h2>
              <p>When you sign up or authenticate with Google Sign-In, we request access only to your standard basic profile:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-gray-900 dark:text-white">Email Address:</strong> Used strictly to identify your account, send account verification, and maintain your secure session.</li>
                <li><strong className="text-gray-900 dark:text-white">Name & Profile Picture:</strong> Used solely to display your avatar and personal greeting within the dashboard.</li>
                <li><strong className="text-gray-900 dark:text-white">Limited Use Disclosure:</strong> LangSQL's use and transfer of information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-[#00E5FF]">Google API Services User Data Policy</a>, including the Limited Use requirements. We never sell, rent, or transfer your Google profile data to third-party advertising networks.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                3. Database Credentials & Encryption
              </h2>
              <p>
                To provide natural language to SQL translation and execution, Users may connect database endpoints (e.g., PostgreSQL, MySQL, Trino, Spark).
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-gray-900 dark:text-white">AES-256 Encryption:</strong> Database hostnames, ports, usernames, and passwords are encrypted using strong AES-256 encryption both client-side and server-side before resting in our MongoDB databases.</li>
                <li><strong className="text-gray-900 dark:text-white">Least-Privilege Recommendation:</strong> We strongly advise users to supply read-only database credentials whenever connecting production databases.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                4. Database Metadata vs. Actual Records
              </h2>
              <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-[#00E5FF]/5 border border-blue-500/20 dark:border-[#00E5FF]/20 space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Zero Data Extraction Policy
                </p>
                <p>
                  LangSQL extracts only structural <strong>metadata (DDL)</strong>: table names, column names, foreign keys, and column data types. We <strong>never store, copy, download, or train AI models</strong> on your actual database rows, customer PII, or internal database records.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                5. AI Processing & Third-Party Providers
              </h2>
              <p>To provide high-accuracy natural language query assistance, the following processors are utilized:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><strong>OpenRouter API / Large Language Models:</strong> Natural language questions and table metadata are transmitted via encrypted HTTPS to generate structured SQL queries.</li>
                <li><strong>Firebase Authentication (Google Cloud):</strong> Authentication provider for token verification and user state.</li>
                <li><strong>MongoDB Atlas:</strong> Managed database for storing encrypted connection configs and query history.</li>
                <li><strong>Vercel:</strong> Static front-end hosting and CDN delivery.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                6. Data Retention & User Rights
              </h2>
              <p>
                You retain complete ownership over your data. You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Delete any connected database configuration at any time from your <em>Manage Databases</em> panel, which immediately destroys the encrypted credentials.</li>
                <li>Clear query execution history and session logs.</li>
                <li>Request permanent account deletion and associated metadata removal.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                7. Contact Us
              </h2>
              <p>
                If you have questions regarding this Privacy Policy, your personal information, or wish to verify domain ownership details, please contact:
              </p>
              <div className="p-4 rounded-xl bg-gray-100 dark:bg-[#1A1A1E] text-gray-800 dark:text-gray-200 space-y-1">
                <p><strong>Maintainer:</strong> Yash Parmar</p>
                <p><strong>Email:</strong> <a href="mailto:admin@yashparmar.in" className="text-blue-600 dark:text-[#00E5FF] underline">admin@yashparmar.in</a></p>
                <p><strong>Website:</strong> <a href="https://langsql.yashparmar.in" className="text-blue-600 dark:text-[#00E5FF] underline">https://langsql.yashparmar.in</a></p>
              </div>
            </section>

          </div>

          {/* Bottom Back Button */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-[#00E5FF] text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
