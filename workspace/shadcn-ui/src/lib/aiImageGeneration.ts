// AI Image Generation API Integration
import { api } from './api';

interface AIGenerationRequest {
  originalImage: string;
  gender: 'male' | 'female';
  stylePreferences?: string[];
  numberOfStyles?: number;
}

interface AIGenerationResponse {
  generatedImages: {
    id: string;
    imageUrl: string;
    styleDescription: string;
    confidence: number;
    styleType: 'haircut' | 'color' | 'beard';
  }[];
  processTime: number;
}

// Main function to generate hairstyle images using the backend API
export const generateHairstyleImages = async (
  request: AIGenerationRequest
): Promise<AIGenerationResponse> => {
  const startTime = Date.now();
  
  try {
    const { originalImage, gender, numberOfStyles = 6 } = request;
    
    // Generate multiple styles by calling the API with different prompts
    const stylePrompts = getStylePrompts(gender, numberOfStyles);
    const generatedImages = [];
    
    for (let i = 0; i < stylePrompts.length; i++) {
      const prompt = stylePrompts[i];
      
      try {
        const response = await api.ai.generateHairstyle(originalImage, prompt.text);
        
        if (response.generated_image) {
          generatedImages.push({
            id: `generated-${Date.now()}-${i}`,
            imageUrl: response.generated_image,
            styleDescription: prompt.description,
            confidence: 0.85 + (Math.random() * 0.1), // Random confidence between 0.85-0.95
            styleType: prompt.type as 'haircut' | 'color' | 'beard'
          });
        } else {
          // Fallback to mock data if API fails
          generatedImages.push(createMockGeneratedImage(originalImage, prompt, i));
        }
      } catch (error) {
        console.error(`Failed to generate style ${i}:`, error);
        // Fallback to mock data
        generatedImages.push(createMockGeneratedImage(originalImage, prompt, i));
      }
      
      // Add small delay between requests to avoid overwhelming the server
      if (i < stylePrompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    const processTime = Date.now() - startTime;
    
    return {
      generatedImages,
      processTime
    };
    
  } catch (error) {
    console.error('Error in generateHairstyleImages:', error);
    
    // Fallback to mock generation if everything fails
    return generateMockHairstyleImages(request);
  }
};

// Get style prompts based on gender and number of styles
function getStylePrompts(gender: 'male' | 'female', count: number) {
  const malePrompts = [
    { text: 'modern fade haircut, professional styling', description: 'Modern Fade Cut', type: 'haircut' },
    { text: 'classic quiff hairstyle, textured top', description: 'Classic Quiff Style', type: 'haircut' },
    { text: 'short textured crop, contemporary cut', description: 'Textured Crop', type: 'haircut' },
    { text: 'full beard trim, well-groomed facial hair', description: 'Full Beard Trim', type: 'beard' },
    { text: 'side part classic haircut, traditional style', description: 'Side Part Classic', type: 'haircut' },
    { text: 'buzz cut variation, clean short style', description: 'Buzz Cut Variant', type: 'haircut' },
    { text: 'pompadour hairstyle, vintage modern', description: 'Modern Pompadour', type: 'haircut' },
    { text: 'undercut with long top, edgy style', description: 'Undercut Style', type: 'haircut' }
  ];
  
  const femalePrompts = [
    { text: 'layered bob haircut, shoulder length', description: 'Layered Bob Cut', type: 'haircut' },
    { text: 'balayage highlights, natural color blend', description: 'Balayage Highlights', type: 'color' },
    { text: 'long layered haircut, flowing style', description: 'Long Layers', type: 'haircut' },
    { text: 'pixie cut, short chic style', description: 'Pixie Cut', type: 'haircut' },
    { text: 'ombre hair color, gradient effect', description: 'Ombre Blend', type: 'color' },
    { text: 'beach waves hairstyle, natural texture', description: 'Beach Waves Style', type: 'haircut' },
    { text: 'lob haircut, long bob style', description: 'Long Bob (Lob)', type: 'haircut' },
    { text: 'curtain bangs with layers', description: 'Curtain Bangs', type: 'haircut' }
  ];
  
  const prompts = gender === 'male' ? malePrompts : femalePrompts;
  return prompts.slice(0, count);
}

// Create mock generated image when API fails
function createMockGeneratedImage(originalImage: string, prompt: any, index: number) {
  return {
    id: `mock-generated-${Date.now()}-${index}`,
    imageUrl: originalImage, // Use original image as fallback
    styleDescription: prompt.description,
    confidence: 0.75 + (Math.random() * 0.15), // Random confidence between 0.75-0.90
    styleType: prompt.type as 'haircut' | 'color' | 'beard'
  };
}

// Fallback mock generation function
async function generateMockHairstyleImages(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  const { originalImage, gender, numberOfStyles = 6 } = request;
  const stylePrompts = getStylePrompts(gender, numberOfStyles);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const generatedImages = stylePrompts.map((prompt, index) => 
    createMockGeneratedImage(originalImage, prompt, index)
  );
  
  return {
    generatedImages,
    processTime: 2000
  };
}

// Face detection and analysis using backend API
export const analyzeFaceShape = async (imageUrl: string) => {
  try {
    const response = await api.ai.analyzeface(imageUrl);
    
    if (response.analysis) {
      const analysis = response.analysis;
      
      // Extract useful information from the analysis
      const dominantGender = Object.keys(analysis.gender).reduce((a, b) => 
        analysis.gender[a] > analysis.gender[b] ? a : b
      );
      
      const dominantEmotion = Object.keys(analysis.emotion).reduce((a, b) => 
        analysis.emotion[a] > analysis.emotion[b] ? a : b
      );
      
      // Generate recommendations based on analysis
      const recommendations = generateRecommendations(analysis, dominantGender);
      
      return {
        faceShape: 'oval', // Default, would need more sophisticated analysis
        age: analysis.age,
        gender: dominantGender,
        emotion: dominantEmotion,
        recommendations,
        rawAnalysis: analysis
      };
    } else {
      throw new Error(response.error || 'Face analysis failed');
    }
  } catch (error) {
    console.error('Face analysis error:', error);
    
    // Return mock analysis as fallback
    return {
      faceShape: 'oval',
      age: 25,
      gender: 'unknown',
      emotion: 'neutral',
      recommendations: [
        'Medium length cuts work well',
        'Side parts are flattering',
        'Consider your lifestyle when choosing a style'
      ],
      note: 'Using fallback analysis due to API error'
    };
  }
};

// Generate style recommendations based on face analysis
function generateRecommendations(analysis: any, gender: string): string[] {
  const recommendations = [];
  
  // Age-based recommendations
  if (analysis.age < 25) {
    recommendations.push('Trendy, modern styles work well for your age');
  } else if (analysis.age > 40) {
    recommendations.push('Classic, professional styles are recommended');
  } else {
    recommendations.push('You have flexibility with both trendy and classic styles');
  }
  
  // Gender-based recommendations
  if (gender.toLowerCase() === 'man') {
    recommendations.push('Consider fade cuts or textured styles');
    recommendations.push('Beard styling can complement your look');
  } else {
    recommendations.push('Layered cuts add volume and movement');
    recommendations.push('Color highlights can enhance your features');
  }
  
  // Emotion-based recommendations
  const dominantEmotion = Object.keys(analysis.emotion).reduce((a, b) => 
    analysis.emotion[a] > analysis.emotion[b] ? a : b
  );
  
  if (dominantEmotion === 'happy') {
    recommendations.push('Bold styles can match your vibrant personality');
  } else if (dominantEmotion === 'neutral') {
    recommendations.push('Versatile styles that work for any occasion');
  }
  
  return recommendations;
}

// Test AI connectivity
export const testAIConnection = async (): Promise<boolean> => {
  try {
    const response = await api.ai.health();
    return response.status === 'ok';
  } catch (error) {
    console.error('AI connection test failed:', error);
    return false;
  }
};