# MMM-MyWordOfTheDay

This a module for [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop).

This shows you Wordnik's Word of the Day.


## Installation
1. Navigate into your MagicMirror `modules` folder and execute<br>
`git clone https://github.com/jclarke0000/MMM-MyWordOfTheDay.git`.
2. Enter the new `MMM-MyWordOfTheDay` directory and execute `npm install`.

## Configuration

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>apiKey</code></td>
      <td><strong>REQUIRED</strong> You need to get an API key from Wordnik.com: <code>http://developer.wordnik.com/</code>.</td>
    </tr>
  </tbody>
</table>

## Sample Config

```
{
  module: "MMM-MyWordOfTheDay",
  position: "top_left",
  header: "Word Of The Day",
  config: {
    apiKey: "..." //private; don't share.
  }
}
```