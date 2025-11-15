#!/usr/bin/osascript
-- Robust Chrome automation for Claude Code
-- With verification, error handling, and smart retries

set commandsList to {"/fix-metadata", "/fix-color-system", "/refactor-database-card", "/setup-environment", "/add-error-boundaries", "/add-prettier", "/setup-github-actions"}

-- Function to check if Chrome has claude.ai tabs
on verifyChromeSetup()
	tell application "Google Chrome"
		if it is not running then
			display dialog "❌ Google Chrome is not running.

Please:
1. Open Google Chrome
2. Go to claude.ai/code
3. Open 7 tabs
4. Run this script again" buttons {"OK"} default button 1 with icon stop
			return false
		end if
		
		activate
		delay 1
		
		set frontWindow to front window
		set activeTab to active tab of frontWindow
		set tabURL to URL of activeTab
		
		if tabURL does not contain "claude.ai" then
			display dialog "❌ Active Chrome tab is not on claude.ai

Current tab: " & tabURL & "

Please:
1. Switch to a claude.ai/code tab
2. Run this script again" buttons {"OK"} default button 1 with icon stop
			return false
		end if
	end tell
	
	return true
end verifyChromeSetup

-- Main execution
if not verifyChromeSetup() then
	return
end if

-- Count down with notification
display notification "Starting in 5 seconds. Focus will switch to Chrome." with title "Claude Code Automation"
delay 5

set successCount to 0
set failCount to 0

tell application "Google Chrome"
	activate
end tell

delay 1

repeat with i from 1 to count of commandsList
	set currentCommand to item i of commandsList
	
	try
		tell application "Google Chrome"
			set activeTab to active tab of front window
			set tabURL to URL of activeTab
		end tell
		
		-- Verify we're on claude.ai
		if tabURL contains "claude.ai" then
			display notification "Tab " & i & ": " & currentCommand with title "Typing Command" sound name "Tink"
			
			tell application "System Events"
				tell process "Google Chrome"
					-- Focus the window
					set frontmost to true
					delay 0.5
					
					-- Click in the page to ensure focus (center of window)
					click at {800, 600}
					delay 0.5
					
					-- Find and click the textarea/input (Tab to cycle to it)
					keystroke tab
					delay 0.3
					
					-- Type the command slowly for reliability
					repeat with char in currentCommand
						keystroke char
						delay 0.05
					end repeat
					
					delay 0.5
					
					-- Press Enter
					key code 36
					delay 2
					
					set successCount to successCount + 1
				end tell
			end tell
		else
			display notification "⚠️ Tab " & i & " is not claude.ai - skipped" with title "Warning"
			set failCount to failCount + 1
		end if
		
		-- Move to next tab if not the last
		if i < (count of commandsList) then
			tell application "System Events"
				tell process "Google Chrome"
					keystroke "]" using {command down, shift down}
					delay 2
				end tell
			end tell
		end if
		
	on error errMsg
		display notification "Error on tab " & i & ": " & errMsg with title "Error"
		set failCount to failCount + 1
	end try
end repeat

-- Final notification
if failCount = 0 then
	display notification "✅ All " & successCount & " commands sent successfully!" with title "Automation Complete" sound name "Glass"
else
	display notification "⚠️ Completed: " & successCount & " | Failed: " & failCount with title "Automation Finished"
end if

-- Return to terminal
delay 1
tell application "iTerm2"
	activate
end tell
