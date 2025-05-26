const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { model } = require('mongoose');

router.get('/search/suggest', async (req, res) => {
  const rawQuery = req.query.q || "";
  const queryTokens = rawQuery.toLowerCase().split(" ").filter(Boolean);

  try {
    const vehicles = await Vehicle.find({}).lean();
    const results = [];

    vehicles.forEach((brandEntry) => {
      const brand = brandEntry.brand || "";
      const brandLower = brand.toLowerCase();

      (brandEntry.years || []).forEach((yearEntry) => {
        const year = yearEntry.year || "";

        (yearEntry.models || []).forEach((modelObj) => {
          // Access the model name from modelObj.model
          if (!modelObj || typeof modelObj.model !== 'string') return;
          const modelName = modelObj.model;
          const modelLower = modelName.toLowerCase();

          const combined = `${brandLower} ${year} ${modelLower}`;

          const isMatch = queryTokens.every(token => combined.includes(token));
          if (isMatch) {
            results.push({
              type: "full_match",
              value: `${brand} ${year} ${modelName}`,
              brand,
              year,
              model: modelName
            });
          }
        });

        // Year-level match
        const yearCombo = `${brandLower} ${year}`;
        if (queryTokens.every(token => yearCombo.includes(token))) {
          results.push({
            type: "year",
            value: year,
            brand
          });
        }
      });

      // Brand-level match
      if (queryTokens.every(token => brandLower.includes(token))) {
        results.push({
          type: "brand",
          value: brand
        });
      }
    });

    const uniqueResults = [];
    const seen = new Set();
    for (const r of results) {
      const key = JSON.stringify(r);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(r);
      }
    }

    res.json(uniqueResults.slice(0, 10));
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error during search" });
  }
});

router.get("/api/faceted-brands", async (req, res) => {
  const search = (req.query.search || "").toLowerCase().trim();
  const searchTerms = search.split(/\s+/); // Split into array of terms

  try {
    const brands = await Vehicle.find({});
    const result = [];
    const brandFacets = new Set();
    const yearFacets = new Set();
    const modelFacets = new Set();

    brands.forEach(brand => {
      const brandName = String(brand.brand);
      const brandNameLower = brandName.toLowerCase();
      
      // Check if ANY search term matches brand
      let brandMatches = searchTerms.some(term => 
        brandNameLower.includes(term)
      );
      
      const matchedYears = [];

      brand.years.forEach(yearObj => {
        const yearStr = String(yearObj.year);
        const yearLower = yearStr.toLowerCase();
        
        // Check if ANY search term matches year
        let yearMatches = searchTerms.some(term =>
          yearLower.includes(term)
        );
        
        const matchedModels = [];

        yearObj.models.forEach(model => {
          const modelName = typeof model === 'object' ? model.model : String(model);
          const modelLower = modelName.toLowerCase();
          
          // Check if ANY search term matches model
          const modelMatches = searchTerms.some(term =>
            modelLower.includes(term)
          );

          if (modelMatches) {
            matchedModels.push({ model: modelName });
            modelFacets.add(modelName);
          }
        });

        if (yearMatches || matchedModels.length > 0) {
          if (yearMatches) yearFacets.add(yearStr);
          matchedYears.push({
            year: yearStr,
            models: yearMatches ? 
              yearObj.models.map(m => ({ 
                model: typeof m === 'object' ? m.model : String(m) 
              })) : 
              matchedModels
          });
        }
      });

      if (brandMatches || matchedYears.length > 0) {
        if (brandMatches) brandFacets.add(brandName);
        result.push({
          brand: brandName,
          years: matchedYears
        });
      }
    });

    res.json({
      content: result,
      facets: {
        brands: Array.from(brandFacets),
        years: Array.from(yearFacets),
        models: Array.from(modelFacets)
      }
    });
  } catch (error) {
    console.error("Error in /api/faceted-brands:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;