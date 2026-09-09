import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react'
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
              <span>Legal & Transparency</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Last Updated: March 2025
            </p>
          </div>

          {/* Core Content Card */}
          <div className="bg-white/80 dark:bg-[#111113]/80 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-6 sm:p-10 shadow-xl space-y-8 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                1. Overview & Commitment
              </h2>
              <p>
                At <strong>LangSQL</strong> ("we", "our", or "us"), we prioritize your privacy and data security. 
                This Privacy Policy outlines how your personal information, database metadata, and natural language prompts are collected, 
                processed, and safeguarded when using our application at <span className="text-blue-600 dark:text-[#00E5FF]">langsql.yashparmar.in</span>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                2. Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <strong className="text-gray-900 dark:text-white">Account Information:</strong> Name, email address, and authentication credentials provided via Firebase Authentication or Google OAuth.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Database Credentials & Connection Strings:</strong> Connection strings (hosts, ports, usernames, passwords) are encrypted client-side and server-side using industry-standard <strong>AES-256 encryption</strong> before being stored in our database.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Database Schema Metadata:</strong> Table names, column types, and structural definitions extracted solely for AI query context generation.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Prompt & Execution Logs:</strong> Natural language prompts submitted to the AI and generated query outputs, used for query history and debugging.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                3. We Never Store Your Raw Database Records
              </h2>
              <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-[#00E5FF]/5 border border-blue-500/20 dark:border-[#00E5FF]/20">
                <p className="font-medium text-gray-900 dark:text-white">
                  <strong>Zero-Data Storage Guarantee:</strong> LangSQL only queries your schema structure (DDL) to understand relationships. We never store, export, or train proprietary foundation models on your internal database records or query results.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                4. Third-Party Service Providers
              </h2>
              <p>We work with trusted external infrastructure services to operate LangSQL:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><strong>Firebase Authentication (Google Cloud):</strong> Identity management and secure user authorization.</li>
                <li><strong>OpenRouter / Hugging Face:</strong> High-performance LLMs for converting questions into optimized SQL queries. Prompts only include table metadata and the user question.</li>
                <li><strong>MongoDB Atlas:</strong> Secure cloud storage for user account states and encrypted credentials.</li>
                <li><strong>Vercel:</strong> Static and edge hosting for our client frontend.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Cookies & Local Storage</h2>
              <p>
                We use secure HTTP-only cookies and local browser storage to manage user authentication sessions and user interface preferences (such as dark/light theme). We do not use intrusive cross-site tracking cookies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Contact & Data Deletion</h2>
              <p>
                You may request account deletion and removal of all saved database connections at any time directly through your account settings or by emailing:
              </p>
              <p className="text-blue-600 dark:text-[#00E5FF] font-semibold">
                support@langsql.yashparmar.in
              </p>
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
