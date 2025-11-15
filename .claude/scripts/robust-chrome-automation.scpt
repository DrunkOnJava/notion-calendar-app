#!/usr/bin/osascript
-- Ultra-robust Chrome automation with full validation

set commandsList to {"/fix-metadata", "/fix-color-system", "/refactor-database-card", "/setup-environment", "/add-error-boundaries", "/add-prettier", "/setup-github-actions"}

-- Validation function
on validateChromeState()
	tell application "System Events"
		-- Check Chrome is running
		if not (exists process "Google Chrome") then
			display dialog "❌ Google Chrome is not running

Start Chrome and open claude.ai/code tabs, then run this again." buttons {"Cancel"} default button 1 with icon stop
			return false
		end if
		
		-- Check Chrome is frontmost
		set frontApp to name of first application process whose frontmost is true
		if frontApp is not "Google Chrome" then
			display dialog "⚠️ Chrome is not the active application

Current app: " & frontApp & "

Activating Chrome now..." buttons {"OK"} default button 1 with icon caution
			tell application "Google Chrome" to activate
			delay 2
		end if
	end tell
	
	-- Verify active tab URL
	tell application "Google Chrome"
		try
			set activeTabURL to URL of active tab of front window
			if activeTabURL does not contain "claude.ai" then
				display dialog "❌ Active Chrome tab is not claude.ai

Current URL: " & activeTabURL & "

Please switch to a claude.ai/code tab and run again." buttons {"Cancel"} default button 1 with icon stop
				return false
			end if
		on error
			display dialog "❌ Cannot access Chrome tabs

Make sure Chrome has at least one window open." buttons {"Cancel"} default button 1 with icon stop
			return false
		end try
	end tell
	
	return true
end validateChromeState

-- Function to type command with validation
on typeCommandSafely(cmd, tabNum)
	tell application "Google Chrome"
		activate
		delay 0.5
	end tell
	
	tell application "System Events"
		tell process "Google Chrome"
			-- Ensure Chrome is frontmost
			set frontmost to true
			delay 0.5
			
			-- Click in center of window to ensure focus
			set windowSize to size of window 1
			set windowPos to position of window 1
			set clickX to (item 1 of windowPos) + ((item 1 of windowSize) / 2)
			set clickY to (item 2 of windowPos) + ((item 2 of windowSize) / 2)
			click at {clickX, clickY}
			delay 0.8
			
			-- Use Cmd+F to test page responsiveness
			keystroke "f" using command down
			delay 0.2
			key code 53 -- Escape to close find
			delay 0.3
			
			-- Now type the command character by character
			repeat with i from 1 to length of cmd
				set char to character i of cmd
				keystroke char
				delay 0.03
			end repeat
			
			delay 0.5
			
			-- Press Return
			key code 36
			delay 1.5
			
			return true
		end tell
	end tell
end typeCommandSafely

-- Function to move to next tab safely
on moveToNextTab()
	tell application "System Events"
		tell process "Google Chrome"
			keystroke "]" using {command down, shift down}
			delay 2
		end tell
	end tell
end moveToNextTab

-- MAIN EXECUTION
display notification "Starting validation checks..." with title "Claude Code Automation"

if not validateChromeState() then
	return
end if

display notification "✅ All checks passed. Starting in 3 seconds..." with title "Claude Code Automation" sound name "Glass"
delay 3

set successCount to 0
set errorList to {}

repeat with i from 1 to count of commandsList
	set currentCommand to item i of commandsList
	
	display notification "Typing: " & currentCommand with title "Tab " & i & " of 7" sound name "Tink"
	
	try
		-- Verify we're still on claude.ai before typing
		tell application "Google Chrome"
			set currentURL to URL of active tab of front window
		end tell
		
		if currentURL does not contain "claude.ai" then
			set end of errorList to "Tab " & i & ": Not on claude.ai (" & currentURL & ")"
		else
			typeCommandSafely(currentCommand, i)
			set successCount to successCount + 1
		end if
		
	on error errMsg
		set end of errorList to "Tab " & i & ": " & errMsg
	end try
	
	-- Move to next tab (except on last iteration)
	if i < count of commandsList then
		moveToNextTab()
	end if
end repeat

-- Final report
set totalCommands to count of commandsList
set failCount to totalCommands - successCount

if failCount = 0 then
	display notification "✅ All " & successCount & " commands executed successfully!" with title "Automation Complete" sound name "Glass"
	display dialog "✅ SUCCESS

All " & successCount & " commands have been sent to Chrome tabs!

Your Claude Code tasks are now running in parallel." buttons {"Great!"} default button 1 with icon note
else
	set errorReport to "⚠️ PARTIAL SUCCESS

Successful: " & successCount & "/" & totalCommands & "
Failed: " & failCount & "

Errors:"
	repeat with err in errorList
		set errorReport to errorReport & "
• " & err
	end repeat
	
	display dialog errorReport buttons {"OK"} default button 1 with icon caution
end if

-- Return to terminal
delay 1
tell application "iTerm2"
	activate
end tell
