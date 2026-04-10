import React from "react";

export default function LegalPage() {
    const lastUpdated = "April 9, 2026";

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-white/90">
            <h1 className="text-4xl font-bold mb-8 text-center text-(--discord-blurple)">
                Legal Information
            </h1>

            <div className="space-y-12">
                {/* Terms of Service Section */}
                <section id="terms" className="scroll-mt-20">
                    <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-2">
                        Terms of Service
                    </h2>
                    <p className="mb-4 opacity-70">
                        Last updated: {lastUpdated}
                    </p>

                    <div className="space-y-4 text-sm leading-relaxed">
                        <p>
                            Welcome to MyStudyPal. By using our service, you
                            agree to these terms. Please read them carefully.
                        </p>

                        <div>
                            <h3 className="font-bold text-lg mb-2">
                                1. Using our Services
                            </h3>
                            <p>
                                You must follow any policies made available to
                                you within the Services. You are responsible for
                                any activity that happens on or through your
                                account.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">
                                2. Content & AI Generation
                            </h3>
                            <p>
                                MyStudyPal uses AI (Google Gemini) to generate
                                study materials. While we strive for accuracy,
                                we do not guarantee the correctness of
                                AI-generated content. You are responsible for
                                verifying any information before using it for
                                academic purposes.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">
                                3. User Submissions
                            </h3>
                            <p>
                                You retain ownership of the documents you
                                upload. However, by uploading them, you grant us
                                the right to process them for the purpose of
                                providing the service (e.g., text extraction and
                                embedding generation).
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">
                                4. Prohibited Conduct
                            </h3>
                            <p>
                                You agree not to use the service for any illegal
                                purposes or to upload content that violates
                                intellectual property rights.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Privacy Policy Section */}
                <section id="privacy" className="scroll-mt-20">
                    <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-2">
                        Privacy Policy
                    </h2>
                    <p className="mb-4 opacity-70">
                        Last updated: {lastUpdated}
                    </p>

                    <div className="space-y-4 text-sm leading-relaxed">
                        <p>
                            Your privacy is important to us. This policy
                            explains how we handle your data.
                        </p>

                        <div>
                            <h3 className="font-bold text-lg mb-2">
                                1. Information We Collect
                            </h3>
                            <ul className="list-disc ml-5 space-y-1">
                                <li>
                                    <strong>Account Info:</strong> Email address
                                    and username provided during signup or via
                                    Google OAuth.
                                </li>
                                <li>
                                    <strong>Study Data:</strong> Documents you
                                    upload and study sets/quizzes you create.
                                </li>
                                <li>
                                    <strong>Usage Data:</strong> Basic logs to
                                    help us improve the platform.
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">
                                2. How We Use Data
                            </h3>
                            <p>
                                We use your data to provide the MyStudyPal
                                service, including generating flashcards and
                                quizzes. We do not sell your personal data to
                                third parties.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">
                                3. Data Storage & Security
                            </h3>
                            <p>
                                We use industry-standard security measures (like
                                JWT and encrypted database connections) to
                                protect your information.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2">
                                4. Third-Party Services
                            </h3>
                            <p>
                                We share document text with Google's Gemini API
                                for the purpose of content generation. Google's
                                use of this data is governed by their own
                                privacy policies.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="text-center pt-8 border-t border-white/10 opacity-50 text-xs">
                    <p>
                        MyStudyPal is an AI-powered study tool. Use responsibly.
                    </p>
                </div>
            </div>
        </div>
    );
}
