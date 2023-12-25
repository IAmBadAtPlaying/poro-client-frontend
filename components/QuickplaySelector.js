export default function QuickplaySelector({champions}) {

    const POSITIONS = {
        TOP: "TOP",
        JUNGLE: "JUNGLE",
        MIDDLE: "MIDDLE",
        BOTTOM: "BOTTOM",
        UTILITY: "UTILITY"
    }

    const setRuneSet = (championId, slotId, runeSite) => {
        if (slotId < 0) {
            console.error("Invalid slotId");
            return;
        }
        if (!champions[championId]) {
            console.error("Invalid championId");
            return;
        }

        if (!runeSite) {
            console.error("Invalid runeSite");
            return;
        }

        if (!runeSite.id || !runeSite.isRecommendationOverride || !runeSite.isTemporary || !runeSite.name || !runeSite.primaryStyleId || !runeSite.selectedPerkIds || !runeSite.subStyleId) {
            console.error("Invalid runeSite");
            return;
        }


    }
}