// src/utils/imageUtils.js
/**
 * Utility functions for handling politician images
 * Enhanced with comprehensive image handling capabilities
 */

/**
 * Helper function to check if an image exists at a given path
 * @param {string} path - Image path to check
 * @returns {boolean} - Whether the image exists
 */
const imageExists = (path) => {
  // This is a client-side function that can't actually check file existence
  // We'll assume the image exists if the path is valid
  return !!path && path.match(/\.(jpg|jpeg|png|gif|webp)$/i);
};

/**
 * Gets a web-hosted image URL for a politician
 * Attempts to find a reliable Wikipedia or government website image
 * 
 * @param {string} name - Politician's name
 * @param {string} id - Politician's ID
 * @returns {string} - URL to a web-hosted image
 */
export const getWebHostedImageUrl = (name, id) => {
  // Map of known politicians to their reliable image URLs
  // Comprehensive database with multiple sources for each politician
  const knownPoliticians = {
    // Top tier politicians - using high-quality official portraits
    'aoc': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Alexandria_Ocasio-Cortez_Official_Portrait.jpg',
    'bernie-sanders': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Bernie_Sanders_in_March_2020.jpg',
    'ilhan-omar': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Ilhan_Omar_official_portrait.jpg',
    'elizabeth-warren': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Elizabeth_Warren%2C_official_portrait%2C_114th_Congress.jpg',
    'cori-bush': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Cori_Bush_117th_Congress.jpg',
    'maxwell-frost': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Maxwell_Frost_official_portrait_118th_Congress.jpg',
    'gavin-newsom': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Gavin_Newsom_by_Gage_Skidmore.jpg',
    'katie-porter': 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Katie_Porter%2C_official_portrait%2C_116th_Congress.jpg',
    'gretchen-whitmer': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Gretchen_Whitmer_official_portrait.jpg',
    'ro-khanna': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Ro_Khanna_official_portrait.jpg',
    'jamaal-bowman': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Jamaal_Bowman_official_portrait.jpg',
    'pramila-jayapal': 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Pramila_Jayapal_official_portrait.jpg',
    'ayanna-pressley': 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Ayanna_Pressley_official_portrait.jpg',
    'rashida-tlaib': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Rashida_Tlaib%2C_official_portrait%2C_116th_Congress.jpg',
    'andy-levin': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Andy_Levin_official_portrait.jpg',
    'jessica-cisneros': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Jessica_Cisneros_2020.jpg',
    'greg-casar': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Greg_Casar_official_portrait.jpg',
    'summer-lee': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Summer_Lee_118th_Congress.jpg',
    'shontel-brown': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Shontel_Brown_official_portrait.jpg',
    'delia-ramirez': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Delia_Ramirez_official_portrait.jpg',
    'robert-garcia': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Robert_Garcia_118th_Congress.jpg',
    'sydney-kamlager': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Sydney_Kamlager_118th_Congress.jpg',
    'andrea-salinas': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Andrea_Salinas_118th_Congress.jpg',
    'jasmine-crockett': 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Jasmine_Crockett_118th_Congress.jpg',
    'becca-balint': 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Becca_Balint_118th_Congress.jpg',
    'keith-ellison': 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Keith_Ellison_official_portrait.jpg',
    'john-fetterman': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/John_Fetterman_official_portrait.jpg',
    'brandon-johnson': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Brandon_Johnson_mayoral_portrait.jpg',
    'ed-markey': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Ed_Markey%2C_official_portrait%2C_114th_Congress.jpg',
    'chuy-garcia': 'https://upload.wikimedia.org/wikipedia/commons/8/81/Jes%C3%BAs_%22Chuy%22_Garc%C3%ADa_117th_Congress.jpg',
    'karen-bass': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Karen_Bass_official_portrait.jpg',
    'mondaire-jones': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Mondaire_Jones_official_portrait.jpg',
    'jeff-merkley': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Jeff_Merkley%2C_115th_official_photo.jpg',
    'michelle-wu': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Michelle_Wu_mayoral_portrait.jpg',
    'chokwe-lumumba': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Chokwe_Antar_Lumumba.jpg',
    'larry-krasner': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Larry_Krasner.jpg',
    'morgan-harper': 'https://upload.wikimedia.org/wikipedia/commons/1/16/Morgan_Harper_2022.jpg',
    'tim-walz': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Tim_Walz_official_photo.jpg',
    'jb-pritzker': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/JB_Pritzker_2022.jpg',
    'josh-shapiro': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Josh_Shapiro_official_portrait.jpg',
    'bob-ferguson': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/AG_Bob_Ferguson.jpg',
    'nikki-saval': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Nikki_Saval.jpg',
    'sydney-kamlager-dove': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Sydney_Kamlager_118th_Congress.jpg',
    'morgan-harper': 'https://upload.wikimedia.org/wikipedia/commons/1/16/Morgan_Harper_2022.jpg',
    'levin': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Andy_Levin_official_portrait.jpg',
    
    // Additional backup images with good face framing
    'aoc-backup': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Alexandria_Ocasio-Cortez_Official_Portrait_2023.jpg',
    'bernie-sanders-backup': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Bernie_Sanders_Close.jpg',
    'ilhan-omar-backup': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Ilhan_Omar_2018.jpg',
    'maxwell-frost-backup': 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Maxwell_Frost_at_White_House.jpg',
    'gavin-newsom-backup': 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Gavin_Newsom_by_Gage_Skidmore_2.jpg',
    'fetterman-backup': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Lt._Gov._John_Fetterman_Portrait_%2846874790005%29.jpg',
    'jayapal-backup': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Pramila_Jayapal_speaking_in_2022.jpg',
    'bowman-backup': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Congressman_Jamaal_Bowman_at_Mamaroneck_Metro-North_Station.jpg',
  };
  
  // Additional sources for major politicians
  const additionalSources = {
    // Top tier politicians - additional sources
    'aoc-alt': 'https://www.congress.gov/img/member/a000173_200.jpg',
    'bernie-sanders-alt': 'https://www.congress.gov/img/member/s000033_200.jpg',
    'ilhan-omar-alt': 'https://www.congress.gov/img/member/o000173_200.jpg',
    'elizabeth-warren-alt': 'https://www.congress.gov/img/member/w000817_200.jpg',
    'maxwell-frost-alt': 'https://www.congress.gov/img/member/f000476_200.jpg',
    'ed-markey-alt': 'https://www.congress.gov/img/member/m000133_200.jpg',
    'katie-porter-alt': 'https://www.congress.gov/img/member/p000618_200.jpg',
    'ro-khanna-alt': 'https://www.congress.gov/img/member/k000389_200.jpg',
    'ayanna-pressley-alt': 'https://www.congress.gov/img/member/p000617_200.jpg',
    'rashida-tlaib-alt': 'https://www.congress.gov/img/member/t000481_200.jpg',
    'jamaal-bowman-alt': 'https://www.congress.gov/img/member/b001223_200.jpg',
    'cori-bush-alt': 'https://www.congress.gov/img/member/b001224_200.jpg',
    'pramila-jayapal-alt': 'https://www.congress.gov/img/member/j000298_200.jpg',
    'greg-casar-alt': 'https://www.congress.gov/img/member/c001131_200.jpg',
    'summer-lee-alt': 'https://www.congress.gov/img/member/l000599_200.jpg',
    'delia-ramirez-alt': 'https://www.congress.gov/img/member/r000617_200.jpg',
    'john-fetterman-alt': 'https://www.senate.gov/artandhistory/history/resources/graphic/xlarge/FettermanJohn.jpg',
    'jeff-merkley-alt': 'https://www.senate.gov/artandhistory/history/resources/graphic/xlarge/MerkleyJeff.jpg',
  };
  
  // Try all possible sources in order
  // 1. Check by ID
  if (id && knownPoliticians[id]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Found image for ${name} by ID: ${id}`);
    }
    return knownPoliticians[id];
  }
  
  // 2. Try to find by normalized name
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  if (knownPoliticians[normalizedName]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Found image for ${name} by normalized name: ${normalizedName}`);
    }
    return knownPoliticians[normalizedName];
  }
  
  // 3. Try with last name only (for common politicians)
  if (name.includes(' ')) {
    const lastName = name.split(' ').pop().toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (knownPoliticians[lastName]) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Found image for ${name} by last name: ${lastName}`);
      }
      return knownPoliticians[lastName];
    }
  }
  
  // 4. Try additional sources with ID
  if (id && additionalSources[`${id}-alt`]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Found alternative image for ${name}: ${id}-alt`);
    }
    return additionalSources[`${id}-alt`];
  }
  
  // 5. Try additional sources with normalized name
  if (additionalSources[`${normalizedName}-alt`]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Found alternative image for ${name} by normalized name: ${normalizedName}-alt`);
    }
    return additionalSources[`${normalizedName}-alt`];
  }
  
  // 6. Try backup sources
  if (id && knownPoliticians[`${id}-backup`]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Using backup image for ${name}: ${id}-backup`);
    }
    return knownPoliticians[`${id}-backup`];
  }
  
  // 7. Try to match by first name + last name pattern
  if (name.includes(' ')) {
    const nameParts = name.split(' ');
    const firstName = nameParts[0].toLowerCase();
    const lastName = nameParts[nameParts.length - 1].toLowerCase();
    const firstLastPattern = `${firstName}-${lastName}`;
    
    if (knownPoliticians[firstLastPattern]) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Found image for ${name} using pattern: ${firstLastPattern}`);
      }
      return knownPoliticians[firstLastPattern];
    }
  }
  
  // 8. Try a generic search-based approach
  const encodedName = encodeURIComponent(name);
  if (process.env.NODE_ENV === 'development') {
    console.log(`No pre-configured image found for ${name}, using Wikipedia search`);
  }
  
  // Return a Wikipedia search URL as last resort
  return `https://en.wikipedia.org/w/index.php?title=Special:Redirect/file/${encodedName.replace(/ /g, '_')}.jpg&width=300`;
};

/**
 * Gets the optimal face positioning for a politician's image
 * 
 * @param {string} id - Politician's ID
 * @returns {string} - CSS object-position value
 */
export const getFacePosition = (id) => {
  // Comprehensive positioning map for all politicians
  const positionMap = {
    // Top tier
    'aoc': 'center center',
    'alexandria-ocasio-cortez': 'center center',
    'bernie-sanders': 'center center',
    'bernie': 'center center',
    'sanders': 'center center',
    'ilhan-omar': 'center center',
    'omar': 'center center',
    'maxwell-frost': 'center center',
    'frost': 'center center',
    'gavin-newsom': 'center center',
    'newsom': 'center center',


    
    // Mid tier

    'cori-bush': 'center center',
    'bush': 'center center',
    'katie-porter': 'center center',
    'porter': 'center center',
    'elizabeth-warren': 'center center',
    'warren': 'center center',
    'gretchen-whitmer': 'center center',
    'whitmer': 'center center',
    'ro-khanna': 'center center',
    'khanna': 'center center',
    'jamaal-bowman': 'center center',
    'bowman': 'center center',
    'pramila-jayapal': 'center center',
    'jayapal': 'center center',
    'ayanna-pressley': 'center center',
    'pressley': 'center center',
    'rashida-tlaib': 'center center',
    'tlaib': 'center center',
    'andy-levin': 'center center',
    'levin': 'center center',
    'ed-markey': 'center center',
    'markey': 'center center',
    // Additional politicians
    // Additional politicians

    'cisneros': 'center center',
    'greg-casar': 'center center',
    'casar': 'center center',
    'summer-lee': 'center center',
    'lee': 'center center',
    'shontel-brown': 'center center',
    'brown': 'center center',
    'delia-ramirez': 'center center',
    'ramirez': 'center center',
    'robert-garcia': 'center center',
    'garcia': 'center center',
    'sydney-kamlager': 'center center',
    'kamlager': 'center center',
    'andrea-salinas': 'center center',
    'salinas': 'center center',
    'jasmine-crockett': 'center center',
    'crockett': 'center center',
    'becca-balint': 'center center',
    'balint': 'center center',
    'karen-bass': 'center center',
    'bass': 'center center',
    'brandon-johnson': 'center center',
    'johnson': 'center center',
    'tim-walz': 'center center',
    'walz': 'center center',
    'jb-pritzker': 'center center',
    'j.b.-pritzker': 'center center',
    'pritzker': 'center center',
    'keith-ellison': 'center center',
    'ellison': 'center center',
    'maura-healey': 'center center',
    'healey': 'center center',
    'josh-shapiro': 'center center',
    'shapiro': 'center center',
    'bob-ferguson': 'center center',
    'ferguson': 'center center',
    'john-fetterman': 'center center',
    'fetterman': 'center center',
    'chuy-garcia': 'center center',
    'mondaire-jones': 'center center',
    'jones': 'center center',
    'jeff-merkley': 'center center',
    'merkley': 'center center',
    'michelle-wu': 'center center',
    'wu': 'center center',
    'chokwe-lumumba': 'center center',
    'lumumba': 'center center',
    'larry-krasner': 'center center',
    'krasner': 'center center',
    'morgan-harper': 'center center',
    'harper': 'center center',
    'nikki-saval': 'center center',
    'saval': 'center center',
  };
  
  // Try direct match
  if (positionMap[id]) {
    return positionMap[id];
  }
  
  // Try lowercase version
  const lowercaseId = id?.toLowerCase();
  if (positionMap[lowercaseId]) {
    return positionMap[lowercaseId];
  }
  
  // Try with dashes replaced by spaces
  const spacedId = lowercaseId?.replace(/-/g, ' ');
  if (positionMap[spacedId]) {
    return positionMap[spacedId];
  }
  
  // Try with spaces replaced by dashes
  const dashedId = lowercaseId?.replace(/ /g, '-');
  if (positionMap[dashedId]) {
    return positionMap[dashedId];
  }
  
  return 'center center'; // Centered default position
};

/**
 * AI-powered face detection simulation
 * This function simulates what an AI face detection system would do
 * by providing intelligent positioning for politician images
 * 
 * @param {string} name - Politician's name
 * @param {string} id - Politician's ID
 * @returns {Object} - Positioning parameters
 */
export const detectFacePosition = (name, id) => {
  // Simulate AI detection with pre-configured values
  const detectionResults = {
    // Define optimal zoom levels and positions for each politician
    'aoc': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'bernie-sanders': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'ilhan-omar': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'maxwell-frost': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'gavin-newsom': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'katie-porter': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'elizabeth-warren': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'cori-bush': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'gretchen-whitmer': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'ro-khanna': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'jamaal-bowman': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'rashida-tlaib': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'ed-markey': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'ayanna-pressley': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'greg-casar': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'summer-lee': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'karen-bass': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'brandon-johnson': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'tim-walz': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'jb-pritzker': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'keith-ellison': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'maura-healey': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'josh-shapiro': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'bob-ferguson': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'john-fetterman': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'pramila-jayapal': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'mondaire-jones': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'jeff-merkley': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'michelle-wu': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'chokwe-lumumba': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'larry-krasner': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'delia-ramirez': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'andrea-salinas': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'sydney-kamlager': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'jasmine-crockett': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'nikki-saval': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'morgan-harper': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'chuy-garcia': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'robert-garcia': { scale: 1.1, offsetY: 0, offsetX: 0 },
    'becca-balint': { scale: 1.1, offsetY: 0, offsetX: 0 },
    // Default values for other politicians
  };
  
  // Try to match by normalized name if ID doesn't match directly
  if (!detectionResults[id] && name) {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (detectionResults[normalizedName]) {
      return detectionResults[normalizedName];
    }
    
    // Try with last name only
    if (name.includes(' ')) {
      const lastName = name.split(' ').pop().toLowerCase().replace(/[^a-z0-9]/g, '-');
      if (detectionResults[lastName]) {
        return detectionResults[lastName];
      }
      
      // Try first-last pattern
      const nameParts = name.split(' ');
      const firstName = nameParts[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
      const firstLastPattern = `${firstName}-${lastName}`;
      
      if (detectionResults[firstLastPattern]) {
        return detectionResults[firstLastPattern];
      }
    }
  }
  
  // Return optimized default values if no match found
  return detectionResults[id] || { scale: 1.1, offsetY: 0, offsetX: 0 };
};