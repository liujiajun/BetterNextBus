import repository from "./repository";

const RESOURCE = "/Announcements";

export default {
    async get() {
        let res = await repository.get(RESOURCE);
        let announcements = [];
        res.data["AnnouncementsResult"]["Announcement"].forEach(announcement => {
            announcements.push({
                id: announcement["ID"],
                text: announcement["Text"],
                date: announcement["Created_On"]
            });
        });
        return announcements;
    }
};