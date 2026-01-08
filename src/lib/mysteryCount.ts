// Utility to track mystery feature count
// Can be easily switched to Supabase later

const MYSTERY_COUNT_KEY = 'mystery_feature_count';

export const getMysteryCount = async (): Promise<number> => {
  try {
    const count = localStorage.getItem(MYSTERY_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('Error getting mystery count:', error);
    return 0;
  }
};

export const incrementMysteryCount = async (): Promise<number> => {
  try {
    const currentCount = await getMysteryCount();
    const newCount = currentCount + 1;
    localStorage.setItem(MYSTERY_COUNT_KEY, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Error incrementing mystery count:', error);
    return 0;
  }
};

// For future Supabase integration:
// import { createClient } from '@supabase/supabase-js';
// 
// const supabase = createClient(process.env.REACT_APP_SUPABASE_URL!, process.env.REACT_APP_SUPABASE_ANON_KEY!);
// 
// export const getMysteryCount = async (): Promise<number> => {
//   const { data, error } = await supabase
//     .from('mystery_counts')
//     .select('count')
//     .single();
//   
//   if (error) return 0;
//   return data?.count || 0;
// };
// 
// export const incrementMysteryCount = async (): Promise<number> => {
//   const { data, error } = await supabase.rpc('increment_mystery_count');
//   if (error) return 0;
//   return data || 0;
// };

