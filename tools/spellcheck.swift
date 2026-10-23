// Spell-check the essays and the sidebar text with the macOS dictionary.
// Usage (from the homepage folder): swift tools/spellcheck.swift
// Exits 1 if anything is flagged, so run it before every deploy.
// Names, jargon and other intended spellings go in tools/spelling-allow.txt (one per line).
import AppKit
import Foundation

let root = URL(fileURLWithPath: CommandLine.arguments[0]).deletingLastPathComponent().deletingLastPathComponent()
let fm = FileManager.default

let allowText = (try? String(contentsOf: root.appendingPathComponent("tools/spelling-allow.txt"), encoding: .utf8)) ?? ""
let allow = Set(allowText.split(separator: "\n").map { $0.trimmingCharacters(in: .whitespaces).lowercased() }.filter { !$0.isEmpty && !$0.hasPrefix("#") })

var files: [String] = []
for dir in ["essays", "essays/work"] {
  let names = (try? fm.contentsOfDirectory(atPath: root.appendingPathComponent(dir).path)) ?? []
  files += names.filter { $0.hasSuffix(".txt") }.sorted().map { "\(dir)/\($0)" }
}
files.append("projects.js")

let checker = NSSpellChecker.shared
checker.automaticallyIdentifiesLanguages = false
_ = checker.setLanguage("en_US")

// Drop text that isn't prose: URLs, `code`, and for projects.js everything but titles and taglines.
func prose(_ line: String, js: Bool) -> String? {
  if js {
    guard let m = line.range(of: #"^\s*(title|tagline):\s*['"](.*)['"],?\s*$"#, options: .regularExpression) else { return nil }
    _ = m
  }
  return line
    .replacingOccurrences(of: #"https?://\S+"#, with: " ", options: .regularExpression)
    .replacingOccurrences(of: #"`[^`]*`"#, with: " ", options: .regularExpression)
    .replacingOccurrences(of: #"^\s*(title|tagline):"#, with: " ", options: .regularExpression)
}

var problems = 0
for file in files {
  guard let text = try? String(contentsOf: root.appendingPathComponent(file), encoding: .utf8) else { continue }
  for (i, raw) in text.components(separatedBy: "\n").enumerated() {
    guard let line = prose(raw, js: file.hasSuffix(".js")) else { continue }
    let ns = line as NSString
    var start = 0
    while start < ns.length {
      let r = checker.checkSpelling(of: line, startingAt: start, language: "en_US", wrap: false, inSpellDocumentWithTag: 0, wordCount: nil)
      if r.location == NSNotFound { break }
      let word = ns.substring(with: r)
      if !allow.contains(word.lowercased()) {
        let guesses = checker.guesses(forWordRange: r, in: line, language: "en_US", inSpellDocumentWithTag: 0) ?? []
        print("\(file):\(i + 1): \(word)\(guesses.isEmpty ? "" : "  -> " + guesses.prefix(3).joined(separator: ", "))")
        problems += 1
      }
      start = r.location + r.length
    }
  }
}
print(problems == 0 ? "spellcheck: clean" : "spellcheck: \(problems) flagged")
exit(problems == 0 ? 0 : 1)
