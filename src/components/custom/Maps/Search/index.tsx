import { useState } from "react";

import { useMapsLibrary } from "@vis.gl/react-google-maps";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import useAsyncEffect from "@/hooks/useAsyncEffect";

import { type Suggestion, searchByAddress } from "@/helpers/maps";

type Props = {
    map: google.maps.Map | null;
    geocoding: google.maps.GeocodingLibrary | null;
};

const MapSearch = ({ map, geocoding }: Props) => {
    const places = useMapsLibrary("places");

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<Array<Suggestion>>([]);

    const suggestionClicked = async (e: unknown) => {
        if (!map || !geocoding) return;

        try {
            const geocoder = new geocoding.Geocoder();

            const response = await geocoder.geocode({
                placeId: e.currentTarget.value,
            });

            if (response.results.length > 0) {
                const result = response.results[0];

                map.panTo({
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng(),
                });

                map.setZoom(15);

                setSuggestions([]);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    };

    useAsyncEffect(async () => {
        if (!places) {
            return;
        }

        if (search.length > 0) {
            try {
                const Suggestions = await searchByAddress({
                    places,
                    address: search,
                });

                setSuggestions(Suggestions);
            } catch (err: unknown) {
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    }, [search]);

    return (
        <>
            <div className="bg-white max-w-[200px]">
                <Input
                    value={search}
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {suggestions.map((suggestion) => (
                <Button value={suggestion.place_id} onClick={suggestionClicked}>
                    {suggestion.description}
                </Button>
            ))}
        </>
    );
};

export default MapSearch;
