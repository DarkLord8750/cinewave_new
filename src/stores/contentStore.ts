import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'movie' | 'series';
  genre: string[];
  releaseYear: number;
  maturityRating: string;
  duration: string;
  posterImage: string;
  backdropImage: string;
  trailerUrl: string;
  featured: boolean;
  seasons?: Season[];
}

export interface Season {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  description: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

interface ContentState {
  contents: Content[];
  featured: Content | null;
  isLoading: boolean;
  error: string | null;
  fetchContents: () => Promise<void>;
  fetchFeatured: () => Promise<void>;
  searchContents: (query: string) => Promise<Content[]>;
  getContentsByGenre: (genre: string) => Content[];
  getContentById: (id: string) => Content | undefined;
  addContent: (content: Omit<Content, 'id'>) => Promise<Content>;
  updateContent: (id: string, content: Partial<Content>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  addSeason: (contentId: string, season: Omit<Season, 'id' | 'seriesId' | 'episodes'>) => Promise<Season>;
  updateSeason: (seasonId: string, season: Partial<Season>) => Promise<void>;
  deleteSeason: (seasonId: string) => Promise<void>;
  addEpisode: (seasonId: string, episode: Omit<Episode, 'id' | 'seasonId'>) => Promise<Episode>;
  updateEpisode: (episodeId: string, episode: Partial<Episode>) => Promise<void>;
  deleteEpisode: (episodeId: string) => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  contents: [],
  featured: null,
  isLoading: false,
  error: null,

  fetchContents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: contents, error } = await supabase
        .from('content')
        .select(`
          *,
          content_genres (
            genres (name)
          ),
          series (
            id,
            seasons (
              *,
              episodes (*)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedContents = contents.map(content => ({
        id: content.id,
        title: content.title,
        description: content.description,
        type: content.type,
        genre: content.content_genres.map(cg => cg.genres.name),
        releaseYear: content.release_year,
        maturityRating: content.maturity_rating,
        duration: content.duration,
        posterImage: content.poster_image,
        backdropImage: content.backdrop_image,
        trailerUrl: content.trailer_url,
        featured: content.featured,
        seasons: content.series?.[0]?.seasons || []
      }));

      set({ contents: formattedContents, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch content', 
        isLoading: false 
      });
    }
  },

  fetchFeatured: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: featured, error } = await supabase
        .from('content')
        .select(`
          *,
          content_genres (
            genres (name)
          )
        `)
        .eq('featured', true)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching featured content:', error);
        set({ featured: null, isLoading: false });
        return;
      }

      if (!featured) {
        console.warn('No featured content found');
        set({ featured: null, isLoading: false });
        return;
      }

      const formattedFeatured = {
        id: featured.id,
        title: featured.title,
        description: featured.description,
        type: featured.type,
        genre: featured.content_genres.map(cg => cg.genres.name),
        releaseYear: featured.release_year,
        maturityRating: featured.maturity_rating,
        duration: featured.duration,
        posterImage: featured.poster_image,
        backdropImage: featured.backdrop_image,
        trailerUrl: featured.trailer_url,
        featured: featured.featured
      };

      set({ featured: formattedFeatured, isLoading: false });
    } catch (error) {
      console.error('Unexpected error fetching featured content:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch featured content', 
        isLoading: false,
        featured: null
      });
    }
  },

  searchContents: async (query: string) => {
    if (!query.trim()) return [];
    
    const { data: contents, error } = await supabase
      .from('content')
      .select(`
        *,
        content_genres (
          genres (name)
        )
      `)
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return contents.map(content => ({
      id: content.id,
      title: content.title,
      description: content.description,
      type: content.type,
      genre: content.content_genres.map(cg => cg.genres.name),
      releaseYear: content.release_year,
      maturityRating: content.maturity_rating,
      duration: content.duration,
      posterImage: content.poster_image,
      backdropImage: content.backdrop_image,
      trailerUrl: content.trailer_url,
      featured: content.featured
    }));
  },

  getContentsByGenre: (genre: string) => {
    const { contents } = get();
    return contents.filter(content => 
      content.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  },

  getContentById: (id: string) => {
    const { contents } = get();
    return contents.find(content => content.id === id);
  },

  addContent: async (content) => {
    const { data, error } = await supabase.rpc('create_content_with_genres', {
      p_title: content.title,
      p_description: content.description,
      p_type: content.type,
      p_release_year: content.releaseYear,
      p_maturity_rating: content.maturityRating,
      p_duration: content.duration,
      p_poster_image: content.posterImage,
      p_backdrop_image: content.backdropImage,
      p_trailer_url: content.trailerUrl,
      p_featured: content.featured,
      p_genre_names: content.genre
    });

    if (error) throw error;

    await get().fetchContents();
    return data;
  },

  updateContent: async (id, content) => {
    const { error } = await supabase
      .from('content')
      .update({
        title: content.title,
        description: content.description,
        type: content.type,
        release_year: content.releaseYear,
        maturity_rating: content.maturityRating,
        duration: content.duration,
        poster_image: content.posterImage,
        backdrop_image: content.backdropImage,
        trailer_url: content.trailerUrl,
        featured: content.featured
      })
      .eq('id', id);

    if (error) throw error;

    if (content.genre) {
      // Update genres
      const { data: genres } = await supabase
        .from('genres')
        .select('id, name');

      if (!genres) throw new Error('Failed to fetch genres');

      const genreIds = content.genre.map(genreName => {
        const genre = genres.find(g => g.name === genreName);
        return genre?.id;
      }).filter(Boolean);

      // Remove existing genres
      await supabase
        .from('content_genres')
        .delete()
        .eq('content_id', id);

      // Add new genres
      await supabase
        .from('content_genres')
        .insert(genreIds.map(genreId => ({
          content_id: id,
          genre_id: genreId
        })));
    }

    await get().fetchContents();
  },

  deleteContent: async (id) => {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await get().fetchContents();
  },

  addSeason: async (contentId, season) => {
    // Get series ID
    const { data: series, error: seriesError } = await supabase
      .from('series')
      .select('id')
      .eq('content_id', contentId)
      .single();

    if (seriesError || !series) throw new Error('Series not found');

    const { data, error } = await supabase
      .from('seasons')
      .insert({
        series_id: series.id,
        season_number: season.seasonNumber,
        title: season.title,
        description: season.description
      })
      .select()
      .single();

    if (error) throw error;
    await get().fetchContents();
    return data;
  },

  updateSeason: async (seasonId, season) => {
    const { error } = await supabase
      .from('seasons')
      .update({
        season_number: season.seasonNumber,
        title: season.title,
        description: season.description
      })
      .eq('id', seasonId);

    if (error) throw error;
    await get().fetchContents();
  },

  deleteSeason: async (seasonId) => {
    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', seasonId);

    if (error) throw error;
    await get().fetchContents();
  },

  addEpisode: async (seasonId, episode) => {
    const { data, error } = await supabase
      .from('episodes')
      .insert({
        season_id: seasonId,
        episode_number: episode.episodeNumber,
        title: episode.title,
        description: episode.description,
        duration: episode.duration,
        thumbnail: episode.thumbnail,
        video_url: episode.videoUrl
      })
      .select()
      .single();

    if (error) throw error;
    await get().fetchContents();
    return data;
  },

  updateEpisode: async (episodeId, episode) => {
    const { error } = await supabase
      .from('episodes')
      .update({
        episode_number: episode.episodeNumber,
        title: episode.title,
        description: episode.description,
        duration: episode.duration,
        thumbnail: episode.thumbnail,
        video_url: episode.videoUrl
      })
      .eq('id', episodeId);

    if (error) throw error;
    await get().fetchContents();
  },

  deleteEpisode: async (episodeId) => {
    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', episodeId);

    if (error) throw error;
    await get().fetchContents();
  }
}));