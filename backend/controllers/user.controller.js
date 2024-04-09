import User from "../models/user.model.js";

export const getUserProfileAndRepos = async (req, res) => {

    const { username } = req.params;
    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        console.log("after user res")
        const userProfile = await userRes.json();
        console.log("after user res parse")
        const repoRes = await fetch(userProfile.repos_url);
        console.log("after repo res")
        const repos = await repoRes.json();
        console.log("after respo parser")

        res.status(200).json({ userProfile, repos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const likeProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findById(req.user._id.toString());
        console.log(user, "auth user");
        const userToLike = await User.findOne({ username });

        if (!userToLike) {
            return res.status(404).json({ error: "User is not a member" });
        }
        if (user.likedProfiles.includes(userToLike.username)) {
            return res.status(400).json({ error: "User already liked" });
        }
        userToLike.likedBy.push({ username: user.username, avatarUrl: user.avatarUrl, likedDate: Date.now() });
        user.likedProfiles.push(userToLike.username);

        // await userToLike.save();
        // await user.save();
        await Promise.all([userToLike.save(), user.save()]);

        res.status(200).json({ message: "User likes successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getLikes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id.toString());
        res.status(200).json({ likedBy: user.likedBy });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};