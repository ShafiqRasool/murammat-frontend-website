import React from 'react';
import ReactPlayer from 'react-player/lazy'; // Using the lazy loader for better website performance
import thumbnail from '../../assets/'

// You can pass a YouTube link or a local .mp4 file path here
import Video from '../../assets/mp_.mp4'
interface PromoVideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl?: string;
}

const PromoVideoPlayer: React.FC<PromoVideoPlayerProps> = ({
  // Defaulting to a placeholder video if none is provided
  videoUrl = Video, 
  // A beautiful thumbnail image to show before the user clicks play
  thumbnailUrl = 
}) => {
  return (
    <section className="w-full py-16 bg-[#FAFAFA] font-sans flex justify-center items-center">
      <div className="max-w-4xl w-full px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            See <span className="text-[#00674F]">Murammat</span> in Action
          </h2>
          <p className="text-[#878787] text-lg max-w-2xl mx-auto">
            Watch how our professional technicians deliver top-tier home services across Lahore.
          </p>
        </div>

        {/* Video Player Container */}
        {/* The wrapper uses a specific padding trick to ensure a perfect 16:9 aspect ratio on all screen sizes */}
        <div className="relative pt-[56.25%] w-full bg-black rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/15 border border-gray-100 group">
          
          <ReactPlayer
            className="absolute top-0 left-0"
            url={videoUrl}
            width="100%"
            height="100%"
            controls={true} // Enables standard user-friendly controls (play, pause, volume, fullscreen)
            light={thumbnailUrl} // Shows an image before playing, which makes your website load MUCH faster
            playing={true} // Automatically starts playing once they click the thumbnail
            
            /* Customizing the play button color to match your Murammat Theme */
            playIcon={
              <button 
                className="w-20 h-20 flex items-center justify-center rounded-full bg-[#00674F] text-white shadow-lg hover:bg-[#004f3d] transition-transform duration-300 transform hover:scale-110 focus:outline-none"
                aria-label="Play Promotional Video"
              >
                {/* SVG Play Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            }
          />
          
        </div>
        
      </div>
    </section>
  );
};

export default PromoVideoPlayer;