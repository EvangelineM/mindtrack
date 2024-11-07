import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import "./moodtracker.css";

const EmojiCalendar = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [value, setValue] = useState(today);
  const [emojis, setEmojis] = useState(() => {
    const savedEmojis = localStorage.getItem("emojis");
    return savedEmojis ? JSON.parse(savedEmojis) : {};
  });
  const [selectedEmoji, setSelectedEmoji] = useState("");

  // Define the emoji to score mapping
  const emojiToScore = {
    "😀": 5, // Very happy
    "😊": 4, // Happy
    "😡": -5, // Very angry
    "😍": 4, // Loved
    "😴": -1, // Tired
    "😭": -4, // Very sad
    "😆": 5, // Very happy
    "🥳": 5, // Excited
    "🤯": -3, // Stressed
    "🥺": -2, // Sad
  };

  // Suggestions based on common moods
  const moodSuggestions = {
    "😀": "Keep spreading positivity!",
    "😊": "You seem content, keep it up!",
    "😡": "Try some deep breaths or a walk to cool down.",
    "😍": "Love is in the air! Share it with loved ones.",
    "😴": "Prioritize rest for better energy tomorrow.",
    "😭": "Take it easy, and talk to someone if needed.",
    "😆": "Laughter is great, keep having fun!",
    "🥳": "Celebrate the small wins!",
    "🤯": "Feeling overwhelmed? Try organizing tasks.",
    "🥺": "It’s okay to feel emotional, stay strong!",
  };

  // Update emojis in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("emojis", JSON.stringify(emojis));
  }, [emojis]);

  // Calculate the cumulative score from emojis
  const calculateCumulativeScores = () => {
    let cumulativeScore = 0;
    const labels = [];
    const data = [];

    // Iterate through each day and calculate the running total
    Object.keys(emojis).forEach((date) => {
      const score = emojiToScore[emojis[date]] || 0;
      cumulativeScore += score;  // Add the current day's score to the cumulative score
      labels.push(date);
      data.push(cumulativeScore); // Store the running total
    });

    return { labels, data };
  };

  // Calculate the most common mood and the associated suggestion
  const calculateMostCommonMood = () => {
    const emojiCount = {};
    let mostCommonEmoji = null;
    let maxCount = 0;

    // Count occurrences of each emoji
    Object.values(emojis).forEach((emoji) => {
      emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
    });

    // Find the emoji with the highest count
    for (let emoji in emojiCount) {
      if (emojiCount[emoji] > maxCount) {
        maxCount = emojiCount[emoji];
        mostCommonEmoji = emoji;
      }
    }

    return mostCommonEmoji;
  };

  const handleDateClick = (date) => {
    const dateString = date.toDateString();

    if (date <= today) {
      if (emojis[dateString]) {
        const newEmojis = { ...emojis };
        delete newEmojis[dateString];
        setEmojis(newEmojis);
      } else if (selectedEmoji) {
        const newEmojis = { ...emojis, [dateString]: selectedEmoji };
        setEmojis(newEmojis);
        setSelectedEmoji(""); // Reset the selected emoji after adding it
      }
    }
    setValue(date);
  };

  const emojiOptions = ["😀", "😊", "😡", "😍", "😴", "😭", "😆", "🥳", "🤯", "🥺"];

  // Get the cumulative chart data
  const { labels, data } = calculateCumulativeScores();

  // Get the most common mood and its suggestion
  const mostCommonMood = calculateMostCommonMood();
  const suggestion = mostCommonMood ? moodSuggestions[mostCommonMood] : "Keep up the great work!";

  // Custom recommendations with links based on mood
  const getRecommendations = (mood) => {
    switch (mood) {
      case "😀":
      case "😆":
      case "🥳":
        return [
          { activity: "Play a fun game", link: "/games" },
          { activity: "Celebrate with journaling", link: "/journal" },
        ];
      case "😊":
      case "😍":
        return [
          { activity: "Journal about your day", link: "/journal" },
          { activity: "Listen to relaxing music", link: "/music" },
        ];
      case "😡":
      case "🤯":
        return [
          { activity: "Try a calming game", link: "/games" },
          { activity: "Listen to soothing music", link: "/music" },
          { activity: "Journal to reflect and release stress", link: "/journal" },
        ];
      case "😭":
      case "🥺":
        return [
          { activity: "Play a comforting game", link: "/games" },
          { activity: "Listen to calming music", link: "/music" },
          { activity: "Write in your journal for self-reflection", link: "/journal" },
        ];
      case "😴":
        return [
          { activity: "Relax with a calm game", link: "/games" },
          { activity: "Listen to ambient music", link: "/music" },
          { activity: "Reflect in your journal before bed", link: "/journal" },
        ];
      default:
        return [
          { activity: "Explore your mood with a game", link: "/games" },
          { activity: "Listen to music that suits your mood", link: "/music" },
          { activity: "Write a quick journal entry", link: "/journal" },
        ];
    }
  };

  const recommendations = getRecommendations(mostCommonMood);

  // Chart data
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Mood Over Time",
        data: data,
        backgroundColor: "#D9753B",
      },
    ],
  };

  return (
    <div className="tracker-container">
      <div className="calendar-container">
        <h1>Track Your Emotions</h1>
        <Calendar
          value={value}
          onClickDay={handleDateClick}
          calendarType="gregory"
          showNeighboringMonth={false}
          tileContent={({ date }) => <div className="emoji-display">{emojis[date.toDateString()] || null}</div>}
          tileDisabled={({ date }) => date > today}
          tileClassName={({ date }) => (date.toDateString() === today.toDateString() ? "highlight-today" : "")}
        />
        <h2>How are you feeling today?</h2>
        <div className="emoji-selector">
          {emojiOptions.map((emoji, index) => (
            <button
              key={index}
              className={`emoji-button ${selectedEmoji === emoji ? "selected" : ""}`}
              onClick={() => setSelectedEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="insights-container">
        <h2>Insights</h2>
        <div className="chart">
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="recommendations">
          <p>Most Common Mood: {mostCommonMood}</p>
          <p>Suggestion: {suggestion}</p>
          <h3>Recommendations</h3>
          <ul>
            {recommendations.map((activity, index) => (
              <li key={index}>
                <a href={activity.link}>{activity.activity}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmojiCalendar;
