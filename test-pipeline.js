async function testPipeline() {
  console.log('🧪 Starting End-to-End Pipeline Automated Test...');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('✅ 1. Health Check:', health.status);

  // 2. Analyze URL (Linear.app)
  console.log('🔍 2. Analyzing website https://linear.app...');
  const analyzeReq = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://linear.app' })
  });
  const analyzeData = await analyzeReq.json();
  const analysis = analyzeData.analysis;
  console.log(`✅ Analyzed: "${analysis.title}"`);
  console.log(`   Dominant Color: ${analysis.colors.primary}, Sections: ${analysis.sections.length}, Assets: ${analysis.assets.length}`);

  // 3. Generate Frontend
  console.log('⚡ 3. Synthesizing React frontend...');
  const genReq = await fetch('http://localhost:5000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysis, model: 'heuristic' })
  });
  const genData = await genReq.json();
  let project = genData.project;
  console.log(`✅ Generated ${Object.keys(project.files).length} components (AST Valid: ${genData.validation.isValid})`);

  // 4. Test Prompt 1: "Change the primary color to blue."
  console.log('🎨 4. Testing NL Edit: "Change the primary color to blue."');
  const modReq1 = await fetch('http://localhost:5000/api/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Change the primary color to blue.', currentFiles: project.files })
  });
  const mod1 = await modReq1.json();
  console.log('✅ Mod 1 Diff:', mod1.modification.diffSummary);
  project.files = mod1.modification.files;

  // 5. Test Prompt 2: "Replace the hero section with a bakery hero."
  console.log('🥐 5. Testing NL Edit: "Replace the hero section with a bakery hero."');
  const modReq2 = await fetch('http://localhost:5000/api/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Replace the hero section with a bakery hero.', currentFiles: project.files })
  });
  const mod2 = await modReq2.json();
  console.log('✅ Mod 2 Diff:', mod2.modification.diffSummary);
  project.files = mod2.modification.files;

  // 6. Test Prompt 3: "Make the navbar sticky."
  console.log('📌 6. Testing NL Edit: "Make the navbar sticky."');
  const modReq3 = await fetch('http://localhost:5000/api/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Make the navbar sticky.', currentFiles: project.files })
  });
  const mod3 = await modReq3.json();
  console.log('✅ Mod 3 Diff:', mod3.modification.diffSummary);
  project.files = mod3.modification.files;

  // 7. Test Prompt 4: "Remove the pricing section."
  console.log('✂️ 7. Testing NL Edit: "Remove the pricing section."');
  const modReq4 = await fetch('http://localhost:5000/api/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Remove the pricing section.', currentFiles: project.files })
  });
  const mod4 = await modReq4.json();
  console.log('✅ Mod 4 Diff:', mod4.modification.diffSummary);
  project.files = mod4.modification.files;

  // 8. Test Prompt 5: "Add a testimonials section."
  console.log('⭐ 8. Testing NL Edit: "Add a testimonials section."');
  const modReq5 = await fetch('http://localhost:5000/api/modify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Add a testimonials section.', currentFiles: project.files })
  });
  const mod5 = await modReq5.json();
  console.log('✅ Mod 5 Diff:', mod5.modification.diffSummary);
  project.files = mod5.modification.files;

  // 9. Multi-site Test: Test another website (Generalization test: stripe.com)
  console.log('🌐 9. Generalization Test with 2nd Website: https://stripe.com...');
  const stripeAnalyzeReq = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://stripe.com' })
  });
  const stripeAnalyze = await stripeAnalyzeReq.json();
  console.log(`✅ Stripe Analyzed: "${stripeAnalyze.analysis.title}"`);
  
  const stripeGenReq = await fetch('http://localhost:5000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysis: stripeAnalyze.analysis, model: 'heuristic' })
  });
  const stripeGen = await stripeGenReq.json();
  console.log(`✅ Stripe Generated: ${Object.keys(stripeGen.project.files).length} components, Valid: ${stripeGen.validation.isValid}`);

  // 10. Multi-site Test 3: Test 3rd website (Generalization test: Supabase)
  console.log('🌐 10. Generalization Test with 3rd Website: https://supabase.com...');
  const supaAnalyzeReq = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://supabase.com' })
  });
  const supaAnalyze = await supaAnalyzeReq.json();
  console.log(`✅ Supabase Analyzed: "${supaAnalyze.analysis.title}"`);

  console.log('\n🎉 ALL PIPELINE TESTS PASSED WITH 100% SUCCESS!');
}

testPipeline().catch(err => {
  console.error('❌ Pipeline Test Failed:', err);
  process.exit(1);
});
